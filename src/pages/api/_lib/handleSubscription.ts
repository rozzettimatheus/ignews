import { query as q } from 'faunadb'
import { fauna } from '../../../services/fauna'
import { stripe } from '../../../services/stripe'

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  const userRef = await fauna.query(
    q.Select('ref', q.Get(q.Match(q.Index('user_by_customer_id'), customerId)))
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscription.id,
    userId: userRef, // fauna ref
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  if (createAction) {
    // add is-case if subscription by stripe is allowed
    await fauna.query(
      q.Create(q.Collection('subscriptions'), {
        data: subscriptionData,
      })
    )
  } else {
    try {
      await fauna.query(
        // q.Update(..., data: { status: subscriptionData.status })
        q.Replace(
          q.Select(
            'ref',
            q.Get(q.Match(q.Index('subscription_by_id'), subscriptionId))
          ),
          {
            data: subscriptionData,
          }
        )
      )
    } catch (err) {
      console.log(err)
    }
  }
}
