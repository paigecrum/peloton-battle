import React from 'react'
import { NavLink } from 'react-router-dom'

const activeStyle = {
  color: 'hsl(218,99%,66%)'
}

export default function Nav() {
  return (
    <nav className='row space-between'>
      <ul className='row nav'>
        <li>
          <NavLink
            to='/'
            exact
            activeStyle={activeStyle}
            className='nav-link'
          >
            Home
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}