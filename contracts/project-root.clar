;; Mori Project Root Contract
;; Clarity v2

;; Constants
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-REGISTERED u101)
(define-constant ERR-NOT-FOUND u102)
(define-constant ERR-INVALID-METADATA u103)
(define-constant ERR-PAUSED u104)

;; Admin and state
(define-data-var admin principal tx-sender)
(define-data-var paused bool false)

;; Project Struct
(define-map projects 
  uint 
  {
    owner: principal,
    location: (string-utf8 100),
    metadata-uri: (string-utf8 256),
    registered-at: uint,
    is-active: bool
  }
)

(define-data-var project-counter uint u0)

;; Helpers
(define-private (is-admin (caller principal))
  (is-eq caller (var-get admin))
)

(define-private (ensure-not-paused)
  (asserts! (not (var-get paused)) (err ERR-PAUSED))
)

;; Admin Functions
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin tx-sender) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)

(define-public (set-paused (should-pause bool))
  (begin
    (asserts! (is-admin tx-sender) (err ERR-NOT-AUTHORIZED))
    (var-set paused should-pause)
    (ok should-pause)
  )
)

;; Public: Register a new sustainability project
(define-public (register-project (location (string-utf8 100)) (metadata-uri (string-utf8 256)))
  (begin
    (ensure-not-paused)
    (asserts! (> (len location) u0) (err ERR-INVALID-METADATA))
    (asserts! (> (len metadata-uri) u0) (err ERR-INVALID-METADATA))
    (let ((id (+ u1 (var-get project-counter))))
      (map-set projects id {
        owner: tx-sender,
        location: location,
        metadata-uri: metadata-uri,
        registered-at: block-height,
        is-active: true
      })
      (var-set project-counter id)
      (ok id)
    )
  )
)

;; Admin: Deactivate a project
(define-public (deactivate-project (project-id uint))
  (begin
    (asserts! (is-admin tx-sender) (err ERR-NOT-AUTHORIZED))
    (match (map-get? projects project-id)
      some-project (begin
        (map-set projects project-id {
          owner: (get owner some-project),
          location: (get location some-project),
          metadata-uri: (get metadata-uri some-project),
          registered-at: (get registered-at some-project),
          is-active: false
        })
        (ok true)
      )
      none (err ERR-NOT-FOUND)
    )
  )
)

;; Read-only: Get project by ID
(define-read-only (get-project (project-id uint))
  (match (map-get? projects project-id)
    some-project (ok some-project)
    none (err ERR-NOT-FOUND)
  )
)

;; Read-only: Get current project count
(define-read-only (get-project-count)
  (ok (var-get project-counter))
)

;; Read-only: Is contract paused
(define-read-only (is-paused)
  (ok (var-get paused))
)

;; Read-only: Get admin
(define-read-only (get-admin)
  (ok (var-get admin))
)

;; Read-only: Is a project active
(define-read-only (is-project-active (project-id uint))
  (match (map-get? projects project-id)
    some-project (ok (get is-active some-project))
    none (err ERR-NOT-FOUND)
  )
)
