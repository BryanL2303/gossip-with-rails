import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LogInPage } from './pages/LogInPage'
import { AccountCreationPage } from './pages/AccountCreationPage'
import { HomePage } from './pages/HomePage'
import { AccountStateProvider } from './pages/homepage/context/AccountStateContext'
import { HomePageStateProvider } from './pages/homepage/context/HomePageStateContext'
import { CurrentDisplayCategoryProvider } from './pages/homepage/context/CurrentDisplayCategoryContext'
import { CurrentDisplayTopicProvider } from './pages/homepage/context/CurrentDisplayTopicContext'

ReactDOM.render(
  <AccountStateProvider>
  <HomePageStateProvider>
  <CurrentDisplayCategoryProvider>
  <CurrentDisplayTopicProvider>
    <Router>
      <Routes>
        <Route path='/' element={<LogInPage/>}/>
        <Route path='/create_account' element={<AccountCreationPage/>}/>      
        <Route path='/home' element={<HomePage/>}/>
      </Routes>
    </Router>
  </CurrentDisplayTopicProvider>
  </CurrentDisplayCategoryProvider>
  </HomePageStateProvider>
  </AccountStateProvider>,
  document.body.appendChild(document.createElement('div')),
)