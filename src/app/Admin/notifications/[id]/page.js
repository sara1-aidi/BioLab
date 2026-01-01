'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';

const NotificationDetailPage = () => {
  const { id } = useParams(); // Récupère l'ID de la notification depuis l'URL
  const router = useRouter();

  // Simule une notification (remplacer par un vrai fetch dans un futur développement)
  const [notification, setNotification] = useState({
    id: id, // Utilisation de l'ID passé en paramètre
    title: 'Nouveau scan ajouté', // Valeur dynamique du titre
    message: 'Un nouveau scan a été uploadé pour le patient X.',
    time: 'Il y a 5 min',
    status: 'Non lu',
  });

  // Marquer la notification comme lue (fonction locale côté client)
  const markAsRead = () => {
    setNotification(prev => ({
      ...prev,
      status: 'Lue',
    }));
  };

  // Gérer l'action d'archivage ou de suppression
  const handleAction = (action) => {
    alert(`Action future : ${action}`);
  };

  // Retour à la liste des notifications
  const handleBack = () => {
    router.push('/notifications');
  };

  // Appeler markAsRead quand la page se charge
  useEffect(() => {
    markAsRead();
  }, []);

  return (
    <Box sx={{
      maxWidth: '800px', 
      margin: 'auto', 
      marginTop: '40px', 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      padding: '24px', 
      boxShadow: 3,
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{
          color: 'hsl(210, 60%, 50%)', // Couleur personnalisée en HSL pour le titre
          marginBottom: '20px',
          textAlign: 'center',
        }}>
        {notification.title}
      </Typography>

      <Box sx={{ marginBottom: '20px' }}>
        <Typography sx={{ color: 'hsl(0, 0%, 50%)', fontSize: '14px' }}>ID :</Typography>
        <Typography sx={{ color: 'hsl(0, 0%, 30%)', fontWeight: '600' }}>{notification.id}</Typography>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <Typography sx={{ color: 'hsl(0, 0%, 50%)', fontSize: '14px' }}>Titre :</Typography>
        <Typography sx={{ color: 'hsl(0, 0%, 10%)', fontWeight: '600', fontSize: '18px' }}>{notification.title}</Typography>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <Typography sx={{ color: 'hsl(0, 0%, 50%)', fontSize: '14px' }}>Message :</Typography>
        <Typography sx={{ color: 'hsl(0, 0%, 40%)' }}>{notification.message}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'hsl(0, 0%, 30%)' }}>
        <Typography>🕒 {notification.time}</Typography>
        <Typography>📌 Statut : <span style={{ color: 'hsl(150, 50%, 50%)' }}>{notification.status}</span></Typography>
      </Box>

      <Box sx={{ paddingTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          onClick={() => handleAction('archiver')}
          sx={{
            backgroundColor: 'hsl(210, 60%, 80%)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'hsl(150, 50%, 70%)',
            },
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '600',
          }}>
          Archive
        </Button>

        <Button 
          onClick={() => handleAction('supprimer')}
          sx={{
            backgroundColor: 'hsl(210, 60%, 80%)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'hsl(150, 50%, 70%)',
            },
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '600',
          }}>
          Delete
        </Button>

        <Button 
          onClick={handleBack}
          sx={{
            backgroundColor: 'hsl(150, 50%, 70%)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'hsl(210, 60%, 80%)',
            },
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '600',
          }}>
          Back to list
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationDetailPage;
