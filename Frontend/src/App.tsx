import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import PrivateRoute from './route/privateRoute'
import RoleBasedRedirect from './route/RoleBasedRedirect'
import Register from './components/Register'
import Layout from './components/layout/Layout'
import StaffLayout from './components/layout/StaffLayout'
import BooksPage from './components/BooksPage'
import BorrowHistoryPage from './components/BorrowHistoryPage'
import './App.css'
import BookManagement from './components/BookManagement'
import { BookProvider } from './components/context/BookContext'
import { TransactionProvider } from './components/context/TransactionContext'
import { UserProvider } from './components/context/UserContext'
import { SocialProvider } from './components/context/SocialContext'
import { FineProvider } from './components/context/FineContext'
import StaffTransaction from './components/StaffPages/StaffTransactions'
import OverdueList from './components/StaffPages/StaffOverduelist'
import StaffUsers from './components/StaffPages/StaffUsers'
import StaffSocial from './components/StaffPages/StaffSocial'
import UserProfile from './components/Profile/UserProfile'
import StaffNotifications from './components/StaffPages/StaffNotifications'
import FineManagement from './components/StaffPages/FineManagement'
import StaffDashboard from './components/StaffPages/StaffDashboard'
// Reader components
import Reader from './components/reader/Reader'
import ReaderDashboard from './components/reader/Dashboard'
import ReaderLanding from './components/reader/Landing'
import ReaderBooks from './components/reader/Books'
import ReaderTransactions from './components/reader/Transactions'
import ReaderSocial from './components/reader/Social'
import BookDetail from './components/reader/BookDetail'
// import ReaderProfile from './components/reader/Profile'
import ReaderNotifications from './components/reader/Notifications'
import Streak from './components/reader/Streak'
import { NotificationProvider } from './components/context/NotificationContext'
import { ProfileProvider } from './components/context/ProfileContext'
import { Suspense } from 'react'

function App() {
  return (
    <Router>
      <Suspense fallback={
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '20px',
          color: '#3f65f2',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div>Dang tai noi dung ...</div>
        </div>
      }>
        <BookProvider>
        <NotificationProvider>
          <ProfileProvider>
            <TransactionProvider>
              <UserProvider>
                <SocialProvider>
                  <FineProvider>
                    <div className="app">
                      <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Role-based redirect for root path */}
                        <Route
                          path="/"
                          element={
                            <PrivateRoute>
                              <RoleBasedRedirect />
                            </PrivateRoute>
                          }
                        />
                        
                        {/* Legacy routes - keeping for backward compatibility */}
                        <Route path="/books" element={
                          <PrivateRoute>
                            <Layout><BooksPage /></Layout>
                          </PrivateRoute>
                        }/>
                        <Route path="/history" element={ 
                          <PrivateRoute>
                            <Layout><BorrowHistoryPage /></Layout>
                          </PrivateRoute>
                        }/>

                        {/* Staff Routes */}
                        <Route path="/staff" element={
                          <PrivateRoute>
                            <StaffLayout> <StaffDashboard /> </StaffLayout>
                          </PrivateRoute>
                        } />
                        <Route path="/staff/books" element={
                          <PrivateRoute>
                            <StaffLayout> <BookManagement /> </StaffLayout>
                          </PrivateRoute>
                        } />
                        <Route path="/staff/transactions" element={
                          <PrivateRoute>
                            <StaffLayout> <StaffTransaction /> </StaffLayout>
                          </PrivateRoute>
                        } />
                        <Route path="/staff/transactions/overdue" element={
                          <PrivateRoute>
                            <StaffLayout> <OverdueList /> </StaffLayout>
                          </PrivateRoute>
                        } />
                        <Route path="/staff/users" element={
                          <PrivateRoute>
                            <StaffLayout> <StaffUsers /> </StaffLayout>
                          </PrivateRoute>
                        } />
                        <Route path="/staff/social" element={
                          <PrivateRoute>
                            <StaffLayout> <StaffSocial /> </StaffLayout>
                          </PrivateRoute>
                        } />
                        <Route path="/profile" element={
                          <PrivateRoute>
                            <StaffLayout> <UserProfile/> </StaffLayout>
                          </PrivateRoute>
                        } />
                        <Route path="/staff/notifications" element={
                          <PrivateRoute>
                            <StaffLayout> <StaffNotifications/> </StaffLayout>
                          </PrivateRoute>
                        } />
                        <Route path="/staff/fines" element={
                          <PrivateRoute>
                            <StaffLayout> <FineManagement/> </StaffLayout>
                          </PrivateRoute>
                        } />

                        {/* Reader Routes - Protected */}
                        <Route path="/reader" element={
                          <PrivateRoute>
                            <Reader />
                          </PrivateRoute>
                        }>
                          <Route index element={<ReaderLanding />} />
                          <Route path="dashboard" element={<ReaderDashboard />} />
                          <Route path="books" element={<ReaderBooks />} />
                          <Route path="transactions" element={<ReaderTransactions />} />
                          <Route path="social" element={<ReaderSocial />} />
                          <Route path="books/:id" element={<BookDetail />} />
                          <Route path="profile" element={<UserProfile />} />
                          <Route path="notifications" element={<ReaderNotifications />} />
                          <Route path="streak" element={<Streak />} />
                        </Route>
                        
                        {/* Wildcard route - redirect to role-based page */}
                        <Route path="*" element={
                          <PrivateRoute>
                            <RoleBasedRedirect />
                          </PrivateRoute>
                        } />
                      </Routes>
                    </div>
                  </FineProvider>
                </SocialProvider>
              </UserProvider>
            </TransactionProvider>
          </ProfileProvider>
        </NotificationProvider>
      </BookProvider>
      </Suspense>
    </Router>
  );
}

export default App;
