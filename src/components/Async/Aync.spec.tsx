import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { Async } from '.'

test('it renders correctly', async () => {
  render(<Async />)

  expect(screen.getByText('Async Component')).toBeInTheDocument()

  screen.logTestingPlaygroundURL() // url for testing

  await waitFor(
    () => {
      return expect(screen.queryByText('Button')).not.toBeInTheDocument()
    }
    // {
    //   timeout: 1000, // default
    // }
  )
})
