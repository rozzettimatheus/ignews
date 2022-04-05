import { render, screen, fireEvent } from '@testing-library/react'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { SubscribeButton } from '.'

jest.mock('next-auth/client')
jest.mock('next/router')

describe('SubscribeButton component', () => {
  it('should render correctly', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  }),
    it('should redirect user to signIn when not authenticated', () => {
      const signInMocked = jest.mocked(signIn)
      const useSessionMocked = jest.mocked(useSession)
      useSessionMocked.mockReturnValueOnce([null, false])

      render(<SubscribeButton />)

      const subscribeBtn = screen.getByText('Subscribe now')
      fireEvent.click(subscribeBtn)

      expect(signInMocked).toHaveBeenCalled()
    }),
    it('should redirect to posts when user has a active subscription', () => {
      const useRouterMocked = jest.mocked(useRouter)
      const useSessionMocked = jest.mocked(useSession)
      const pushMock = jest.fn()
      useSessionMocked.mockReturnValueOnce([
        {
          user: {
            name: 'John Doe',
            email: 'john-doe@example.com',
          },
          activeSubscription: 'fake-active-subscription',
          expires: 'fake-expiration-date',
        },
        false,
      ])

      useRouterMocked.mockReturnValueOnce({
        push: pushMock,
      } as any)

      render(<SubscribeButton />)

      const subscribeBtn = screen.getByText('Subscribe now')
      fireEvent.click(subscribeBtn)

      expect(pushMock).toHaveBeenCalled()
    })
})
