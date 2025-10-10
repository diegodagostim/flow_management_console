import { Link } from 'react-router-dom'
import { Search, Settings } from 'lucide-react'
import { FlowLogo } from '@/components/icons/FlowLogo'
import { FlowLogoAlt } from '@/components/icons/FlowLogoAlt'
import { FlowLogoModern } from '@/components/icons/FlowLogoModern'
import { FlowLogoMinimal } from '@/components/icons/FlowLogoMinimal'
import { TopbarDateTime } from './TopbarDateTime'

export function Topbar() {
  return (
    <div className="topbar bg-white shadow-sm border-bottom">
      <div className="container-xxl d-flex align-items-center justify-content-between py-2">
        {/* Logo and Title - Left */}
        <div className="d-flex align-items-center">
          <Link to="/dashboard" className="text-decoration-none">
            <FlowLogoAlt size={32} showText={true} />
          </Link>
        </div>

        {/* Global Search - Center */}
        <div className="d-flex align-items-center flex-grow-1 justify-content-center mx-3 d-none d-md-flex">
          <div className="input-group global-search">
            <span className="input-group-text bg-light border-end-0 rounded-start-3">
              <Search className="h-4 w-4 text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 bg-light rounded-end-3"
              placeholder="Search clients, suppliers..."
              aria-label="Global Search"
            />
          </div>
        </div>

        {/* Mobile Search - Hidden on desktop */}
        <div className="d-flex align-items-center d-md-none me-2">
          <button className="btn btn-outline-secondary btn-sm" title="Search">
            <Search className="h-4 w-4" />
          </button>
        </div>

        {/* DateTime and User Menu - Right */}
        <div className="d-flex align-items-center justify-content-center h-100">
          {/* DateTime Display */}
          <TopbarDateTime />
          <div className="dropdown">
            <a className="nav-link dropdown-toggle hide-arrow d-flex align-items-center justify-content-center h-100" href="#" data-bs-toggle="dropdown">
              <div className="avatar d-flex align-items-center justify-content-center">
                <div className="w-px-40 h-px-40 rounded-circle bg-primary d-flex align-items-center justify-content-center">
                  <span className="text-white fw-semibold">U</span>
                </div>
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a className="dropdown-item" href="#">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar">
                        <div className="w-px-40 h-px-40 rounded-circle bg-primary d-flex align-items-center justify-content-center">
                          <span className="text-white fw-semibold">U</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-semibold d-block">User</span>
                      <small className="text-muted">Admin</small>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li>
                <Link className="dropdown-item" to="/settings">
                  <Settings className="h-4 w-4 me-2" />
                  <span className="align-middle">Settings</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
