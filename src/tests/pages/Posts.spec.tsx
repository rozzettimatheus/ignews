import { render, screen } from '@testing-library/react'

import { getPrismicClient } from '../../services/prismic'
import Posts, { getStaticProps } from '../../pages/posts'

const posts = [
  {
    slug: 'my-new-post',
    title: 'My New Post',
    excerpt: 'Post excerpt',
    updatedAt: '10 de Abril',
  },
]

jest.mock('../../services/prismic')

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
  }),
    it('should load initial data', async () => {
      const getPrismicClientMocked = jest.mocked(getPrismicClient)

      getPrismicClientMocked.mockReturnValueOnce({
        query: jest.fn().mockResolvedValueOnce({
          results: [
            {
              uid: 'my-new-post',
              data: {
                title: [{ type: 'heading', text: 'My New Post' }],
                content: [{ type: 'paragraph', text: 'Post excerpt' }],
              },
              last_publication_date: '04-04-2022',
            },
          ],
        }),
      } as any)

      const response = await getStaticProps({})

      expect(response).toEqual(
        expect.objectContaining({
          props: {
            posts: [
              {
                slug: 'my-new-post',
                title: 'My New Post',
                excerpt: 'Post excerpt',
                updatedAt: 'April 04, 2022',
              },
            ],
          },
        })
      )
    })
})
