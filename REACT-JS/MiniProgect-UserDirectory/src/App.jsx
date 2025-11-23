import React from 'react';
import { useFetch } from './hooks/useFetch';
import './App.css'


const API_URL = 'https://jsonplaceholder.typicode.com/users'

function App() {
    const { data: users, loading, error } = useFetch(API_URL);

    if (loading) {
      return (
        <div className='app'>
          <h1> annuare d'utilsateurs</h1>
          <div className='loading'>chaegement des utilisateurs..</div>
        </div>
      );
    }
    if(error){
      return (
        <div className='app'>
          <h1>annuare d'utilsateurs</h1>
          <div className='error'>erreur :{error}</div>
        </div>
      );
    }

  return (
    <div className='app'>
      <header className='app-header'>
      <h1>annuare d'utilsateurs</h1>
      <p>{users.length} utilisateurs trouves</p>
      </header>

      <main className='user-list'>
        {users.map(user => (
          <div key={user.id} className='user-card'>
            <h2>{user.name}</h2>
            <p className='user-email'>{user.email}</p>
            <p className='user-phone'>{user.phone}</p>
            <p className='user-website'>{user.website}</p>
            <div className='user-adress'>
              <strong>adresse:</strong><br />
              {user.adresse.street}, {user.adress.city}<br />
              {user.adress.zipcode}
            </div>
            <p className='user-company'>
              <strong>Entreprise :</strong> {user.company.name}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App