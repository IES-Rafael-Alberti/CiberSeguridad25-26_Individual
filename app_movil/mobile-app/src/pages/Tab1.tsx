import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonThumbnail, IonText, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { cartOutline } from 'ionicons/icons';
import { api } from '../services/api';
import './Tab1.css';

const Tab1: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));

  const loadProducts = () => {
    api.getProducts().then(data => {
      if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    }).catch(err => console.error('Error fetching products', err));
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadProducts();
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    try {
      const data = await api.login({ role: 'client' });
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Tienda Veterinaria</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tienda</IonTitle>
          </IonToolbar>
        </IonHeader>

        {!isLoggedIn && (
          <div className="ion-padding">
            <IonButton expand="block" onClick={handleLogin}>
              Simular Login Cliente (Dev)
            </IonButton>
            <p className="ion-text-center">Debes iniciar sesión para ver los productos.</p>
          </div>
        )}
        
        <IonList>
          {products.length === 0 ? (
            <IonItem>
              <IonLabel>No hay productos disponibles.</IonLabel>
            </IonItem>
          ) : (
            products.map((product: any) => (
              <IonItem key={product.id}>
                <IonThumbnail slot="start">
                  <img alt={product.name} src={product.imageUrl || 'https://placehold.co/100x100?text=Product'} />
                </IonThumbnail>
                <IonLabel>
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                  <IonText color="success">
                    <strong>{product.price}€</strong>
                  </IonText>
                </IonLabel>
                <IonButton slot="end" fill="clear">
                  <IonIcon icon={cartOutline} />
                </IonButton>
              </IonItem>
            ))
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
