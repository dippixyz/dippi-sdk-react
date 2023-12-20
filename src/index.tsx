import * as React from 'react'
import styles from './styles.module.css'
import { SignInForm } from './components/SignIn';
// import { ButtonSignIn } from './components/buttonSignIn';
interface Props {
  text: string
}

export const ExampleComponent = ({ text }: Props) => {
  return <div className={styles.test}>Example Component: {text}</div>
}

export const SignInComponent = () => {
  return <SignInForm />
}

// export const ButtonSignInComponent = () => {
//   return <ButtonSignIn />
// }

export { default as ButtonSignIn } from './components/buttonSignIn';
