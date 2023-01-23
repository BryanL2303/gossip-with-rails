import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CookiesProvider } from "react-cookie";
import { LogInPage } from './pages/LogInPage'
import { AccountCreationPage } from './pages/AccountCreationPage'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'
import { HomePageStateProvider } from './pages/homepage/context/HomePageStateContext'
import { CurrentDisplayCommunityProvider } from './pages/homepage/context/CurrentDisplayCommunityContext'
import { CurrentDisplayTopicProvider } from './pages/homepage/context/CurrentDisplayTopicContext'
import { CategoryDictionaryProvider } from './pages/homepage/context/CategoryDictionaryContext'
import { PinnedCommunitiesProvider } from './pages/homepage/context/PinnedCommunitiesContext'
import { PinnedTopicsProvider } from './pages/homepage/context/PinnedTopicsContext'

ReactDOM.render(
  <CookiesProvider>
  <HomePageStateProvider>
  <CurrentDisplayCommunityProvider>
  <CurrentDisplayTopicProvider>
  <CategoryDictionaryProvider>
  <PinnedCommunitiesProvider>
  <PinnedTopicsProvider>
    <Router>
      <Routes>
        <Route path='/' element={<LogInPage/>}/>
        <Route path='/create_account' element={<AccountCreationPage/>}/>      
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/admin' element={<AdminPage/>}/>
      </Routes>
    </Router>
  </PinnedTopicsProvider>
  </PinnedCommunitiesProvider>
  </CategoryDictionaryProvider>
  </CurrentDisplayTopicProvider>
  </CurrentDisplayCommunityProvider>
  </HomePageStateProvider>
  </CookiesProvider>,
  document.body.appendChild(document.createElement('div')),
)