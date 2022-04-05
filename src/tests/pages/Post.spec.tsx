import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/client'

import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post content</p>',
  updatedAt: '10 de Abril',
}

jest.mock('../../services/prismic')
jest.mock('next-auth/client')

describe('Post page', () => {
  it('should render correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(screen.getByText('Post content')).toBeInTheDocument()
  }),
    it('should redirect user if no subscription is found', async () => {
      const getSessionMocked = jest.mocked(getSession)

      getSessionMocked.mockResolvedValueOnce(null)

      const response = await getServerSideProps({
        params: { slug: 'my-new-post' },
      } as any)

      expect(response).toEqual(
        expect.objectContaining({
          redirect: expect.objectContaining({
            destination: '/',
          }),
        })
      )
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

      const response = await getServerSideProps({
        params: { slug: 'my-new-post' },
      } as any)

      expect(response).toEqual(
        expect.objectContaining({
          props: {
            post: {
              slug: 'my-new-post',
              title: 'My New Post',
              content: '<p>Post Content</p>',
              updatedAt: 'April 04, 2022',
            },
          },
        })
      )
    })
})
