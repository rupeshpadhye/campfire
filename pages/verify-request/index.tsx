import React  from "react";
import { Banner, Header } from "../../components/LandingPage";

import MailSent from './../../public/mail_sent.svg';

export default function verifyRequest ({ baseUrl }) {
    return (
      <div className='verify-request'>
        <Header hideSignInBtn={true}/>
        <Banner 
        title= 'Check your email'  
        desc='A sign in link has been sent to your email address.'
        setPlan={null}
        />
        <div style={{ display: 'flex', justifyContent: 'center'}}>
            <MailSent/>
        </div>
      </div>
    )
  }