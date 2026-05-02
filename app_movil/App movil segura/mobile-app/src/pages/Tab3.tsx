import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonListHeader, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { star } from 'ionicons/icons';
import { api } from '../services/api';
import './Tab3.css';

const Tab3: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  
  useEffect(() => {
    api.getExclusiveOffers().then(data => {
      if (data && Array.isArray(data.offers)) {
        setOffers(data.offers);
      }
    }).catch(err => console.error('Error fetching offers', err));
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Adopciones y Ofertas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Adopciones</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonListHeader>
          <IonLabel>Ofertas Exclusivas (ABAC)</IonLabel>
        </IonListHeader>

        {offers.length === 0 ? (
          <IonItem lines="none">
            <IonLabel color="medium" className="ion-text-wrap">
              No tienes ofertas exclusivas disponibles. Adopta una mascota para desbloquearlas.
            </IonLabel>
          </IonItem>
        ) : (
          offers.map((offer, index) => (
            <IonCard key={offer.code || index}>
              <IonCardHeader>
                <IonCardSubtitle>¡Oferta Especial!</IonCardSubtitle>
                <IonCardTitle>{offer.code}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{offer.description}</p>
                <IonBadge color="primary">{offer.discount}% de descuento</IonBadge>
                <IonButton expand="block" fill="outline" className="ion-margin-top">
                  <IonIcon slot="start" icon={star} />
                  Canjear
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))
        )}

        <IonListHeader>
          <IonLabel>Solicitar Adopción</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonLabel>
            <h2>Explorar mascotas disponibles</h2>
            <p>Visítanos para conocer a tu nuevo mejor amigo.</p>
          </IonLabel>
          <IonButton slot="end">Ver más</IonButton>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
