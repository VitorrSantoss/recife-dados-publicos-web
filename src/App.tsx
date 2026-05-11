import React from 'react';
// Importamos a sua página principal usando o atalho que configuramos!
import {DashboardPage} from '@/pages/DashboardPage';

function App() {
  return (
    // O fragmento vazio <> </> é útil caso você queira adicionar 
    // provedores de contexto (Context Providers) no futuro.
    <>
      <DashboardPage />
    </>
  );
}

export default App;