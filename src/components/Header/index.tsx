/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { Hamburger } from '../Hamburger'
import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav className={`${styles.headerNav} ${isOpen && styles.open}`}>
          <div className={styles.navLinks}>
            <a className={styles.active}>Home</a>
            <a>Posts</a>
          </div>
          <SignInButton />
        </nav>

        <Hamburger
          onMenuChange={() => setIsOpen(prev => !prev)}
          currentState={isOpen}
        />
      </div>
    </header>
  )
}
