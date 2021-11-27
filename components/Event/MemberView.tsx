import React  from "react";
import EventsList from "./EventList";
import OnlineParty from './../../public/online_party.svg';

import styles from './MemberView.module.scss';
import { Row, Card, Col, Image } from "antd";

const { Meta } = Card;
import Link from "next/link";


// const EventList = ({ events, title, desc }) => {
//   return (
//     <div className={styles.eventsContainer}>
//       <h1>{title}</h1>
//       <p>{desc}</p>
//       <Row gutter={[16, 16]}>
//         {events.map((event) => {
//           return (
//             <Col span={4} key={event.id}>
//               <Link href={`/events/${event.id}/participate`}>
//                 <Card
//                   hoverable
//                   className={styles.eventCard}
//                   style={{ width: 240 }}
//                   key={event.id}
//                   cover={
//                     <Image
//                       className={styles.antImage}
//                       src={
//                         event.headerImage ||
//                         "https://cdn.pixabay.com/photo/2017/07/21/23/57/concert-2527495__340.jpg"
//                       }
//                       preview={false}
//                     />
//                   }
//                 >
               
//                 </Card>
//               </Link>
//             </Col>
//           );
//         })}
//       </Row>
//     </div>
//   );
// };

const MemberView = ({ events = [] }) => {
    if(!events.length) {
       return <div className={styles.emptyState}> 
       <OnlineParty/> 
       <h1 className={styles.emptyStateText}>Hold on the excitement, Team will be creating new activities</h1>
       </div> 
    }
    return (
      <EventsList title="Events" desc=""  events={events} isPreview={false} />
    );
  };

export default MemberView;