/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import Link from 'next/link'

import { Hamburger } from '../Hamburger'
import { SignInButton } from '../SignInButton'
import { ActiveLink } from '../ActiveLink'
import styles from './styles.module.scss'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav className={`${styles.headerNav} ${isOpen && styles.open}`}>
          <div className={styles.navLinks}>
            <ActiveLink activeClassName={styles.active} href="/">
              <a>Home</a>
            </ActiveLink>
            <ActiveLink activeClassName={styles.active} href="/posts">
              <a>Posts</a>
            </ActiveLink>
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
