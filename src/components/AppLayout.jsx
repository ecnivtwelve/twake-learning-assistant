import cx from 'classnames'
import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import { BarComponent } from 'cozy-bar'
import CommentIcon from 'cozy-ui/transpiled/react/Icons/Comment'
import LibraryIcon from 'cozy-ui/transpiled/react/Icons/Library'
import ListIcon from 'cozy-ui/transpiled/react/Icons/List'
import StatsIcon from 'cozy-ui/transpiled/react/Icons/Stats'
import Nav, {
  NavIcon,
  NavItem,
  NavText,
  genNavLink
} from 'cozy-ui/transpiled/react/Nav'
import Sidebar from 'cozy-ui/transpiled/react/Sidebar'

const ExampleRouterNavLink = ({
  children,
  className,
  active,
  activeClassName,
  ...rest
}) => (
  <a className={cx(className, active ? activeClassName : null)} {...rest}>
    {children}
  </a>
)

const NavLink = genNavLink(ExampleRouterNavLink)

const NAV_ITEMS = [
  { path: 'activities', icon: ListIcon },
  { path: 'questions', icon: CommentIcon },
  { path: 'sources', icon: LibraryIcon },
  { path: 'insights', icon: StatsIcon }
]

const AppLayout = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const currentTab = location.pathname.slice(1)

  return (
    <>
      <Sidebar>
        <Nav>
          <NavItem>
            {NAV_ITEMS.map(({ path, icon }) => (
              <NavLink
                key={path}
                active={currentTab.includes(path)}
                onClick={() => navigate(`/${path}`)}
              >
                <NavIcon icon={icon} />
                <NavText>{t(path)}</NavText>
              </NavLink>
            ))}
          </NavItem>
        </Nav>
      </Sidebar>
      <BarComponent searchOptions={{ enabled: true }} />
      <Outlet />
    </>
  )
}

export default AppLayout
