import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Topbar } from './Topbar'
import { DateTimeDisplay } from './DateTimeDisplay'
import { 
  Home, 
  Users, 
  Building2, 
  DollarSign, 
  Settings as SettingsIcon,
  ChevronLeft,
  Menu
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Suppliers', href: '/suppliers', icon: Building2 },
  { name: 'Finance', href: '/finance', icon: DollarSign },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
]

interface SneatLayoutProps {
  children: React.ReactNode
}

export function SneatLayout({ children }: SneatLayoutProps) {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="layout-wrapper layout-content-navbar">
      {/* Topbar */}
      <Topbar />
      
      <div className="layout-container">
        {/* Menu */}
        <aside id="layout-menu" className={`layout-menu menu-vertical menu bg-menu-theme ${isMenuOpen ? 'show' : ''}`}>
          <div className="app-brand demo">
            <button 
              className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <ChevronLeft className="h-4 w-4 align-middle" />
            </button>
          </div>

          <div className="menu-inner-shadow"></div>

          <ul className="menu-inner py-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name} className={`menu-item ${isActive ? 'active' : ''}`}>
                  <Link to={item.href} className="menu-link">
                    <i className="menu-icon tf-icons">
                      <item.icon className="h-4 w-4" />
                    </i>
                    <div data-i18n="Analytics">{item.name}</div>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Time and Date Display */}
          <DateTimeDisplay />
        </aside>
        {/* / Menu */}

        {/* Layout container */}
        <div className="layout-page">
          {/* Navbar */}
          <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
              <button 
                className="nav-item nav-link px-0 me-xl-4"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>

            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
              {/* Empty navbar - all functionality moved to topbar */}
            </div>
          </nav>
          {/* / Navbar */}

          {/* Content wrapper */}
          <div className="content-wrapper">
            {/* Content */}
            <div className="container-xxl flex-grow-1 container-p-y">
              {children}
            </div>
            {/* / Content */}

            {/* Footer */}
            <footer className="content-footer footer bg-footer-theme">
              <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                <div className="mb-2 mb-md-0">
                  <small className="text-muted">
                    © {new Date().getFullYear()}, made by{' '}
                    <a href="#" target="_blank" className="footer-link">Flow Management Team</a>
                  </small>
                </div>
                <div>
                  <small className="text-muted">
                    <a href="#" className="footer-link me-4" target="_blank">License</a>
                    <a href="#" target="_blank" className="footer-link me-4">Documentation</a>
                    <a href="#" target="_blank" className="footer-link me-4">Support</a>
                  </small>
                </div>
              </div>
            </footer>
            {/* / Footer */}

            <div className="content-backdrop fade"></div>
          </div>
          {/* Content wrapper */}
        </div>
        {/* / Layout page */}
      </div>

      {/* Overlay */}
      <div className="layout-overlay layout-menu-toggle" onClick={() => setIsMenuOpen(false)}></div>
    </div>
  )
}
