import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonToast, IonBadge } from '@ionic/react';
import { api } from '../services/api';
import './Tab2.css';

const Tab2: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    api.getServices().then(data => {
      if (data && Array.isArray(data.services)) {
        setServices(data.services);
      }
    }).catch(err => console.error('Error fetching services', err));
  }, []);

  const handleBook = (id: string) => {
    api.bookService(id).then(res => {
      setToastMsg('Servicio reservado con éxito');
      setShowToast(true);
    }).catch(err => {
      setToastMsg('Error al reservar');
      setShowToast(true);
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonTitle>Servicios Veterinarios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Servicios</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {services.map(s => (
            <IonItem key={s.id}>
              <IonLabel>
                <h2>{s.name}</h2>
                <p>{s.description}</p>
                <IonBadge color="primary">{s.price}€</IonBadge>
              </IonLabel>
              <IonButton slot="end" size="small" onClick={() => handleBook(s.id)}>
                Reservar
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMsg}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
