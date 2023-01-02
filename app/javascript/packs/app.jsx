import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LogInPage } from './pages/LogInPage'
import { AccountCreationPage } from './pages/AccountCreationPage'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'
import { AccountStateProvider } from './pages/homepage/context/AccountStateContext'
import { HomePageStateProvider } from './pages/homepage/context/HomePageStateContext'
import { CurrentDisplayCommunityProvider } from './pages/homepage/context/CurrentDisplayCommunityContext'
import { CurrentDisplayTopicProvider } from './pages/homepage/context/CurrentDisplayTopicContext'

ReactDOM.render(
  <AccountStateProvider>
  <HomePageStateProvider>
  <CurrentDisplayCommunityProvider>
  <CurrentDisplayTopicProvider>
    <Router>
      <Routes>
        <Route path='/' element={<LogInPage/>}/>
        <Route path='/create_account' element={<AccountCreationPage/>}/>      
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/admin' element={<AdminPage/>}/>
      </Routes>
    </Router>
  </CurrentDisplayTopicProvider>
  </CurrentDisplayCommunityProvider>
  </HomePageStateProvider>
  </AccountStateProvider>,
  document.body.appendChild(document.createElement('div')),
)