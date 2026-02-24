import cx from 'classnames'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

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
  { path: 'activities', icon: ListIcon, enabled: ['activities', 'item'] },
  { path: 'questions', icon: CommentIcon, enabled: ['questions'] },
  { path: 'sources', icon: LibraryIcon, enabled: ['sources'] }
]

const SidebarComponent = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const currentTab = location.pathname.slice(1)

  return (
    <Sidebar>
      <Nav>
        {NAV_ITEMS.map(({ path, icon, enabled }) => (
          <NavItem key={path}>
            <NavLink
              active={enabled.some(enabledPath =>
                currentTab.includes(enabledPath)
              )}
              onClick={() => navigate(`/${path}`)}
            >
              <NavIcon icon={icon} />
              <NavText>{t(`${path}.title`)}</NavText>
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </Sidebar>
  )
}

export default SidebarComponent
