import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ContentProvider } from './content/ContentContext';
import { LanguageProvider } from './i18n/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import { AdminAuthProvider, RequireAdmin } from './admin/AdminAuth';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import Overview from './admin/pages/Overview';
import ProfileEditor from './admin/pages/ProfileEditor';
import HomeEditor from './admin/pages/HomeEditor';
import AboutEditor from './admin/pages/AboutEditor';
import ApproachEditor from './admin/pages/ApproachEditor';
import ServicesEditor from './admin/pages/ServicesEditor';
import ConditionsEditor from './admin/pages/ConditionsEditor';
import MediaEditor from './admin/pages/MediaEditor';
import PublicationsEditor from './admin/pages/PublicationsEditor';
import ContactEditor from './admin/pages/ContactEditor';
import LabelsEditor from './admin/pages/LabelsEditor';
import SettingsEditor from './admin/pages/SettingsEditor';
import TestimonialsEditor from './admin/pages/TestimonialsEditor';

export default function App() {
  return (
    <ContentProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AdminAuthProvider>
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<Overview />} />
                <Route path="profile" element={<ProfileEditor />} />
                <Route path="home" element={<HomeEditor />} />
                <Route path="about" element={<AboutEditor />} />
                <Route path="approach" element={<ApproachEditor />} />
                <Route path="services" element={<ServicesEditor />} />
                <Route path="conditions" element={<ConditionsEditor />} />
                <Route path="media" element={<MediaEditor />} />
                <Route path="testimonials" element={<TestimonialsEditor />} />
                <Route path="publications" element={<PublicationsEditor />} />
                <Route path="contact" element={<ContactEditor />} />
                <Route path="labels" element={<LabelsEditor />} />
                <Route path="settings" element={<SettingsEditor />} />
              </Route>

              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="services" element={<Services />} />
                <Route path="resources" element={<Resources />} />
                <Route path="contact" element={<Contact />} />
                <Route path="approach" element={<Navigate to="/about" replace />} />
                <Route path="conditions" element={<Navigate to="/services" replace />} />
                <Route path="media" element={<Navigate to="/resources" replace />} />
                <Route path="publications" element={<Navigate to="/resources" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </AdminAuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ContentProvider>
  );
}
