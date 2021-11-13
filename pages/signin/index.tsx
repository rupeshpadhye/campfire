   
import { providers, signIn, getSession, csrfToken } from "next-auth/client";
import { Header, Banner } from "./../../components/LandingPage";
import { Button, Input, Row, Col, Divider, Form, Alert } from 'antd';

import styles from "./signin.module.scss";
import { GithubOutlined,GoogleOutlined  } from '@ant-design/icons';

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      providers: await providers(context),
      csrfToken: await csrfToken(context),
    },
  };
}

const getIcon = (provider) => { 
  switch (provider) {
    case "google":
      return "google";
    case "github":
      return <GithubOutlined />
    default:
      return null;
  }
}

function signin({
  csrfToken,
  providers,
  callbackUrl,
  email,
  error: errorType,
}) {

  const providersToRender =  Object.values(providers).filter((provider) => {
    if (provider.type === "oauth" || provider.type === "email") {
      return true
    } else if (provider.type === "credentials" && provider.credentials) {
      return true
    }
    return false
  })

  const errors = {
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallback: "Try signing in with a different account.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailCreateAccount: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email inbox.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    default: "Unable to sign in.",
  }

  const error = errorType && (errors[errorType] ?? errors.default)
  const emailProvider =  providersToRender.find((provider) => provider.type === "email");


  return (
    <div >
    <Header hideSignInBtn={true}/>
    <div className={styles.background}>
    <Banner setPlan={null}></Banner>
    <Row>
      <Col md={8} xs={0}>
      </Col>
      <Col md={8} xs={24}>
      <div className={styles.signinContainer}>
      {error && (
         <Alert
         message={error}
         type="error"
         showIcon
       />
      )}
      <div className={styles.provider}>
        <h3>Sign In with</h3>
        {
          providersToRender.filter((provider) => provider.type === "oauth").map((provider) =>  (
            <form action={provider.signinUrl} method="POST">
            <input type="hidden" name="csrfToken" value={csrfToken} />
            {callbackUrl && (
              <input type="hidden" name="callbackUrl" value={callbackUrl}  required/>
            )}
            <Button htmlType="submit" icon={getIcon(provider.id)}>
             {provider.name}
            </Button>
          </form> )
          )}
      </div>
      <Divider/>
      <h3>Sign In with Email</h3>
      { emailProvider ? 
      ( 
        <form action={emailProvider.signinUrl} method="POST">
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input
          id={`input-email-for-${emailProvider.id}-provider`}
          autoFocus
          type="email"
          name="email"
          value={email}
          placeholder="email@example.com"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        />  
        <Button htmlType='submit' type='primary'>Sign in with Email</Button>
      </form> 
      ) : null }
    </div>
      </Col>
      <Col md={8} xs={0}>
      </Col>
    </Row>

    </div>
    </div>
  )
}

export default signin;

