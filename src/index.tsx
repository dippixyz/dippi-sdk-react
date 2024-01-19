import * as React from 'react'
import styles from './styles.module.css'
import './output.css'

interface Props {
  text: string
}

export const ExampleComponent = ({ text }: Props) => {
  return <div className={styles.test}>Example Component: {text}</div>
}

export { default as ButtonSignIn } from './components/buttonSignIn';
export { default as ChangePasswordForm } from './components/ChangePassword';
export { DippiProvider } from './components/DippiProvider';
export { default as DisconnectModal } from './components/Disconnect';


