import { describe, it, expect, beforeEach } from 'vitest'

type Project = {
  owner: string
  location: string
  metadataUri: string
  registeredAt: number
  isActive: boolean
}

const MAX_URI_LENGTH = 256
const MAX_LOCATION_LENGTH = 100

enum Errors {
  NotAuthorized = 100,
  AlreadyRegistered = 101,
  NotFound = 102,
  InvalidMetadata = 103,
  Paused = 104,
}

const ZERO_ADDRESS = 'SP000000000000000000002Q6VF78'

const mockContract = {
  admin: 'ST1ADMIN1234567890',
  paused: false,
  projectCounter: 0,
  projects: new Map<number, Project>(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  setPaused(caller: string, pause: boolean) {
    if (!this.isAdmin(caller)) return { error: Errors.NotAuthorized }
    this.paused = pause
    return { value: pause }
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: Errors.NotAuthorized }
    this.admin = newAdmin
    return { value: true }
  },

  registerProject(caller: string, location: string, metadataUri: string, blockHeight: number) {
    if (this.paused) return { error: Errors.Paused }
    if (location.length === 0 || location.length > MAX_LOCATION_LENGTH) return { error: Errors.InvalidMetadata }
    if (metadataUri.length === 0 || metadataUri.length > MAX_URI_LENGTH) return { error: Errors.InvalidMetadata }

    const projectId = this.projectCounter + 1
    const project: Project = {
      owner: caller,
      location,
      metadataUri,
      registeredAt: blockHeight,
      isActive: true,
    }

    this.projects.set(projectId, project)
    this.projectCounter = projectId

    return { value: projectId }
  },

  deactivateProject(caller: string, projectId: number) {
    if (!this.isAdmin(caller)) return { error: Errors.NotAuthorized }

    const project = this.projects.get(projectId)
    if (!project) return { error: Errors.NotFound }

    this.projects.set(projectId, { ...project, isActive: false })
    return { value: true }
  },

  getProject(projectId: number) {
    const project = this.projects.get(projectId)
    if (!project) return { error: Errors.NotFound }
    return { value: project }
  },

  isProjectActive(projectId: number) {
    const project = this.projects.get(projectId)
    if (!project) return { error: Errors.NotFound }
    return { value: project.isActive }
  },

  getProjectCount() {
    return { value: this.projectCounter }
  },

  isPaused() {
    return { value: this.paused }
  },

  getAdmin() {
    return { value: this.admin }
  },
}

describe('Mori Project Root Contract (Mock)', () => {
  const caller = 'ST2PROJECTOWNER1234'
  const blockHeight = 123456

  beforeEach(() => {
    mockContract.admin = 'ST1ADMIN1234567890'
    mockContract.paused = false
    mockContract.projectCounter = 0
    mockContract.projects = new Map()
  })

  it('should allow admin to transfer admin rights', () => {
    const result = mockContract.transferAdmin(mockContract.admin, 'ST3NEWADMIN')
    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe('ST3NEWADMIN')
  })

  it('should not allow non-admin to transfer admin rights', () => {
    const result = mockContract.transferAdmin('ST2RANDO', 'ST3NEWADMIN')
    expect(result).toEqual({ error: Errors.NotAuthorized })
  })

  it('should allow project registration with valid data', () => {
    const result = mockContract.registerProject(caller, 'Regen Forest Zone', 'ipfs://somehash', blockHeight)
    expect(result).toEqual({ value: 1 })

    const stored = mockContract.getProject(1)
    expect(stored.value?.owner).toBe(caller)
    expect(stored.value?.location).toBe('Regen Forest Zone')
    expect(stored.value?.metadataUri).toBe('ipfs://somehash')
    expect(stored.value?.isActive).toBe(true)
  })

  it('should reject project registration when contract is paused', () => {
    mockContract.setPaused(mockContract.admin, true)
    const result = mockContract.registerProject(caller, 'Eco Village', 'ipfs://data', blockHeight)
    expect(result).toEqual({ error: Errors.Paused })
  })

  it('should reject invalid metadata input', () => {
    const resultEmpty = mockContract.registerProject(caller, '', '', blockHeight)
    expect(resultEmpty).toEqual({ error: Errors.InvalidMetadata })

    const longLocation = 'L'.repeat(101)
    const resultLong = mockContract.registerProject(caller, longLocation, 'ipfs://valid', blockHeight)
    expect(resultLong).toEqual({ error: Errors.InvalidMetadata })
  })

  it('should allow admin to deactivate a project', () => {
    mockContract.registerProject(caller, 'Zone A', 'ipfs://1', blockHeight)
    const result = mockContract.deactivateProject(mockContract.admin, 1)
    expect(result).toEqual({ value: true })

    const status = mockContract.isProjectActive(1)
    expect(status).toEqual({ value: false })
  })

  it('should reject deactivation of nonexistent project', () => {
    const result = mockContract.deactivateProject(mockContract.admin, 999)
    expect(result).toEqual({ error: Errors.NotFound })
  })

  it('should return current project count', () => {
    mockContract.registerProject(caller, 'Zone A', 'ipfs://1', blockHeight)
    mockContract.registerProject(caller, 'Zone B', 'ipfs://2', blockHeight)
    const result = mockContract.getProjectCount()
    expect(result).toEqual({ value: 2 })
  })

  it('should confirm pause state and admin identity', () => {
    const pausedState = mockContract.isPaused()
    const admin = mockContract.getAdmin()
    expect(pausedState).toEqual({ value: false })
    expect(admin).toEqual({ value: 'ST1ADMIN1234567890' })
  })
})
