import { FaBars } from 'react-icons/fa'
import { useState, useCallback } from 'react'

import styles from './styles.module.scss'

interface HamburgerProps {
  onMenuChange: () => void
  currentState: boolean
}

export function Hamburger({ onMenuChange, currentState }: HamburgerProps) {
  const onMenuToggle = () => {
    document.body.style.overflowY = !currentState ? 'hidden' : 'initial'
    onMenuChange()
  }

  return (
    <button className={styles.hamburger} onClick={onMenuToggle}>
      <FaBars color="#e1e1e6" />
    </button>
  )
}
