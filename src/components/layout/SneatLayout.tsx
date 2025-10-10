import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Topbar } from './Topbar'
import { DateTimeDisplay } from './DateTimeDisplay'
import { 
  Home, 
  Users, 
  Building2, 
  DollarSign, 
  Shield,
  Settings as SettingsIcon,
  ChevronLeft,
  Menu,
  Brain,
  CreditCard
} from 'lucide-react'
import { TrafficLightIcon } from '@/components/icons/TrafficLightIcon'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Suppliers', href: '/suppliers', icon: Building2 },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Finance', href: '/finance', icon: DollarSign },
  { name: 'AI & Insights', href: '/ai-insights', icon: Brain },
  { name: 'FlowWatch', href: '/watchdog', icon: Shield },
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

          {/* Settings Link at Bottom */}
          <div className="menu-bottom">
            <ul className="menu-inner py-1">
              <li className={`menu-item ${location.pathname === '/settings' ? 'active' : ''}`}>
                <Link to="/settings" className="menu-link">
                  <i className="menu-icon tf-icons">
                    <SettingsIcon className="h-4 w-4" />
                  </i>
                  <div data-i18n="Settings">Settings</div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Time and Date Display */}
          <DateTimeDisplay />
        </aside>
        {/* / Menu */}

        {/* Layout container */}
        <div className="layout-page">
          {/* Content wrapper */}
          <div className="content-wrapper">
            {/* Content */}
            <div className="container-xxl flex-grow-1 container-p-y">
              {children}
            </div>
            {/* / Content */}

            {/* Minimal Footer */}
            <footer className="content-footer">
              <div className="container-xxl">
                <small className="text-muted">
                  © {new Date().getFullYear()} Flow Management Console
                </small>
              </div>
            </footer>
            {/* / Minimal Footer */}

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
