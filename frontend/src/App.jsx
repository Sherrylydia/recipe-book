import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';
import routes from './routes';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import PrivateRoute from './components/Layout/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RecipeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                {routes.map((route, index) => (
                  route.private ? (
                    <Route
                      key={index}
                      path={route.path}
                      element={<PrivateRoute>{route.component}</PrivateRoute>}
                    />
                  ) : (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.component}
                    />
                  )
                ))}
              </Routes>
            </main>
            <Footer />
          </div>
        </RecipeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;