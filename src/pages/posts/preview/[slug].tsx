import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/client'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { RichText } from 'prismic-dom'
import { useEffect } from 'react'
import { getPrismicClient } from '../../../services/prismic'

import styles from '../post.module.scss'

interface PostPropsProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
    thumbnail?: {
      src: string
      alt: string
    }
  }
}

export default function PostPreview({ post }: PostPropsProps) {
  const [session] = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{post.title} | Ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          {/* <img
            className={styles.thumbnail}
            src={post.thumbnail.src}
            alt={post.thumbnail.alt}
          /> */}

          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

/**
 * 2 tipos de formato estatico
 *    1. gerar estaticas durante a build (30 categorias num ecommerce - pouco)
 *    2. gerar a pagina estatica no primeiro acesso (1000 produtos - muito)
 *    3. metade de cada
 *
 *  GetStaticPaths só existe em rotas dinâmicas
 *  - rotas fixas são geradas automaticamente pelo next de forma estatica
 */
export const getStaticPaths: GetStaticPaths = async () => {
  // requisicao com os posts mais acessados e colocar no path

  return {
    paths: [
      // {
      //   params: {
      //     slug: 'build-a-web-server-using-node-and-express',
      //   },
      // },
    ], // todos os posts
    fallback: 'blocking', // true, false, 'blocking'

    // true -> se alguem acessar uma pag nao carregada, ele carrega pelo lado do browser (problema: layout shift, )
    // false -> se nao foi gerado ainda, devolve um 404
    // blocking -> se alguem acessar uma pag nao carregada, vai tentar carregar pelo server
  }
}

// é estatico
// preview nao precisa verificar assinatura - é gratuito
// req nao existe
/**
 * precisa verificar se o usuario tem uma assinatura ativa
 * - nao tem sentido mostrar o preview
 * - mas pelo staticprops nao da pra ver isso
 * - executado num contexto que nao tem as informacoes do usuario logado
 * - entao tem q ver direto do client
 */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const prismic = getPrismicClient()
  const response = await prismic.getByUID('post', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    thumbnail: {
      alt: response.data.thumbnail?.alt,
      src: response.data.thumbnail?.url,
    },
    content: RichText.asHtml(response.data.content.splice(0, 2)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'en-US',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  }

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 min
  }
}
