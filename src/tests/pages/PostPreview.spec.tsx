import { render, screen } from '@testing-library/react'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post content</p>',
  updatedAt: '10 de Abril',
}

jest.mock('next-auth/client')
jest.mock('next/router')
jest.mock('../../services/prismic')

describe('PostPreview page', () => {
  it('should render correctly', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])

    render(<Post post={post} />)

    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  }),
    it('should redirect user to full post when a subscription is found', async () => {
      const useSessionMocked = jest.mocked(useSession)
      const useRouterMocked = jest.mocked(useRouter)
      const pushMock = jest.fn()

      useSessionMocked.mockReturnValueOnce([
        { activeSubscription: 'fake-active-subscription' },
        false,
      ] as any)

      useRouterMocked.mockReturnValueOnce({
        push: pushMock,
      } as any)

      render(<Post post={post} />)

      expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    }),
    it('should load initial data', async () => {
      const getSessionMocked = jest.mocked(getSession)
      const getPrismicClientMocked = jest.mocked(getPrismicClient)

      getSessionMocked.mockResolvedValueOnce({
        activeSubscription: 'fake-active-subscription',
      })

      getPrismicClientMocked.mockReturnValueOnce({
        getByUID: jest.fn().mockResolvedValueOnce({
          data: {
            title: [{ type: 'heading', text: 'My New Post' }],
            content: [{ type: 'paragraph', text: 'Post Content' }],
          },
          last_publication_date: '04-04-2022',
        }),
      } as any)

      const response = await getStaticProps({ params: { slug: 'my-new-post' } })

      expect(response).toEqual(
        expect.objectContaining({
          props: {
            post: expect.objectContaining({
              slug: 'my-new-post',
              title: 'My New Post',
              content: '<p>Post Content</p>',
              updatedAt: 'April 04, 2022',
            }),
          },
        })
      )
    })
})
