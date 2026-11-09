// src/App.jsx
// ==============================================================================
// BACK OFFICE ODC CAMPUS - GESTION DES SERVICES & TROMBINOSCOPE
// Application d'administration moderne, fluide et sécurisée (CRUD complet)
// Développé avec React, Axios et CSS natif haute performance.
// ==============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './App.css';

// Constantes de configuration de l'API Backend NestJS (surchargeable via variable d'environnement Vite)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const SERVICES_ENDPOINT = `${API_BASE_URL}/configurations/app.services`;
const UPLOAD_ENDPOINT = `${API_BASE_URL}/uploads`;

// Clé de persistance pour l'historique local de la galerie d'images
const STORAGE_KEY_GALLERY = 'odc_campus_trombinoscope_gallery';

function App() {
  // ----------------------------------------------------------------------------
  // ÉTATS GLOBAUX : SERVICES & CRUD
  // ----------------------------------------------------------------------------
  const [services, setServices] = useState([]);
  const [chargementServices, setChargementServices] = useState(true);
  const [nouveauService, setNouveauService] = useState({ name: '', url: '' });
  const [envoiAjout, setEnvoiAjout] = useState(false);

  // Recherche / Filtrage dans la liste des services
  const [recherche, setRecherche] = useState('');

  // États pour les modales (Modification & Suppression)
  const [serviceEnEdition, setServiceEnEdition] = useState(null); // { index, name, url }
  const [serviceASupprimer, setServiceASupprimer] = useState(null); // { index, name }
  const [chargementModal, setChargementModal] = useState(false);

  // ----------------------------------------------------------------------------
  // ÉTATS GLOBAUX : TROMBINOSCOPE & UPLOAD
  // ----------------------------------------------------------------------------
  const [fichierImage, setFichierImage] = useState(null);
  const [apercuLocal, setApercuLocal] = useState(null);
  const [envoiUpload, setEnvoiUpload] = useState(false);
  const [galerie, setGalerie] = useState(() => {
    // Récupérer l'historique des images sauvegardées localement au chargement
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GALLERY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [urlCopiee, setUrlCopiee] = useState(null);
  const [glissementFichier, setGlissementFichier] = useState(false);
  const inputFichierRef = useRef(null);

  // ----------------------------------------------------------------------------
  // ÉTATS D'INTERFACE & FEEDBACK (TOASTS & SANTÉ API)
  // ----------------------------------------------------------------------------
  const [toasts, setToasts] = useState([]);
  const [statutApi, setStatutApi] = useState('verification'); // 'connecte' | 'erreur' | 'verification'
  const [ongletActif, setOngletActif] = useState('tous'); // 'tous' | 'services' | 'trombinoscope'

  // Sauvegarder la galerie dans le localStorage dès qu'elle change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(galerie));
    } catch (e) {
      console.warn("Impossible d'enregistrer la galerie dans le localStorage", e);
    }
  }, [galerie]);

  // ----------------------------------------------------------------------------
  // GESTIONNAIRE DE NOTIFICATIONS TOAST
  // ----------------------------------------------------------------------------
  const ajouterToast = useCallback((message, type = 'succes') => {
    const id = Date.now() + Math.random();
    setToasts((precedents) => [...precedents, { id, message, type }]);

    // Disparition automatique après 3.8 secondes
    setTimeout(() => {
      setToasts((precedents) => precedents.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const fermerToast = (id) => {
    setToasts((precedents) => precedents.filter((t) => t.id !== id));
  };

  // ----------------------------------------------------------------------------
  // CHARGEMENT DE LA LISTE DES SERVICES (READ)
  // ----------------------------------------------------------------------------
  const chargerServices = useCallback(async (silencieux = false) => {
    if (!silencieux) setChargementServices(true);
    try {
      const response = await axios.get(SERVICES_ENDPOINT);
      // Le backend NestJS stocke la liste dans response.data.value.services
      const liste = response.data?.value?.services || [];
      setServices(liste);
      setStatutApi('connecte');
    } catch (error) {
      console.error('Erreur lors du chargement des services :', error);
      setStatutApi('erreur');
      if (!silencieux) {
        ajouterToast('Erreur de connexion avec le serveur backend (Port 3000)', 'erreur');
      }
    } finally {
      if (!silencieux) setChargementServices(false);
    }
  }, [ajouterToast]);

  useEffect(() => {
    chargerServices();
  }, [chargerServices]);

  // ----------------------------------------------------------------------------
  // AJOUT D'UN NOUVEAU SERVICE (CREATE)
  // ----------------------------------------------------------------------------
  const handleAjouterService = async (e) => {
    e.preventDefault();
    const nom = nouveauService.name.trim();
    let url = nouveauService.url.trim();

    if (!nom || !url) {
      ajouterToast('Veuillez remplir le nom et l’URL du service', 'attention');
      return;
    }

    // Ajout automatique du protocole https:// si omis pour une URL valide
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    setEnvoiAjout(true);
    const nouvelleListe = [...services, { name: nom, url }];

    try {
      await axios.patch(SERVICES_ENDPOINT, {
        value: { services: nouvelleListe },
      });
      setServices(nouvelleListe);
      setNouveauService({ name: '', url: '' });
      setStatutApi('connecte');
      ajouterToast(`Service « ${nom} » ajouté avec succès !`, 'succes');
    } catch (error) {
      console.error("Erreur lors de l'ajout du service :", error);
      ajouterToast("Échec de l'enregistrement du service sur le serveur", 'erreur');
    } finally {
      setEnvoiAjout(false);
    }
  };

  // ----------------------------------------------------------------------------
  // MODIFICATION D'UN SERVICE (UPDATE)
  // ----------------------------------------------------------------------------
  const ouvrirModalEdition = (index) => {
    const service = services[index];
    if (service) {
      setServiceEnEdition({ index, name: service.name, url: service.url });
    }
  };

  const fermerModalEdition = () => {
    if (!chargementModal) setServiceEnEdition(null);
  };

  const handleSauvegarderEdition = async (e) => {
    e.preventDefault();
    if (!serviceEnEdition) return;

    const nom = serviceEnEdition.name.trim();
    let url = serviceEnEdition.url.trim();

    if (!nom || !url) {
      ajouterToast('Le nom et l’URL ne peuvent pas être vides', 'attention');
      return;
    }

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    setChargementModal(true);
    const nouvelleListe = [...services];
    nouvelleListe[serviceEnEdition.index] = { name: nom, url };

    try {
      await axios.patch(SERVICES_ENDPOINT, {
        value: { services: nouvelleListe },
      });
      setServices(nouvelleListe);
      setServiceEnEdition(null);
      setStatutApi('connecte');
      ajouterToast(`Service « ${nom} » mis à jour avec succès !`, 'succes');
    } catch (error) {
      console.error('Erreur lors de la modification :', error);
      ajouterToast('Erreur lors de la mise à jour du service', 'erreur');
    } finally {
      setChargementModal(false);
    }
  };

  // ----------------------------------------------------------------------------
  // SUPPRESSION D'UN SERVICE (DELETE)
  // ----------------------------------------------------------------------------
  const demanderSuppression = (index) => {
    const service = services[index];
    if (service) {
      setServiceASupprimer({ index, name: service.name });
    }
  };

  const fermerModalSuppression = () => {
    if (!chargementModal) setServiceASupprimer(null);
  };

  const handleConfirmerSuppression = async () => {
    if (!serviceASupprimer) return;

    setChargementModal(true);
    const nomSupprime = serviceASupprimer.name;
    const nouvelleListe = services.filter((_, idx) => idx !== serviceASupprimer.index);

    try {
      await axios.patch(SERVICES_ENDPOINT, {
        value: { services: nouvelleListe },
      });
      setServices(nouvelleListe);
      setServiceASupprimer(null);
      setStatutApi('connecte');
      ajouterToast(`Service « ${nomSupprime} » supprimé de la liste`, 'succes');
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      ajouterToast('Erreur lors de la suppression du service', 'erreur');
    } finally {
      setChargementModal(false);
    }
  };

  // ----------------------------------------------------------------------------
  // GESTION DU TROMBINOSCOPE : SÉLECTION & APERÇU LOCAL
  // ----------------------------------------------------------------------------
  const handleSelectionFichier = (file) => {
    if (!file) return;

    // Vérification du type MIME (images uniquement)
    if (!file.type.startsWith('image/')) {
      ajouterToast('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP...)', 'attention');
      return;
    }

    setFichierImage(file);
    // Création d'une URL de prévisualisation locale dans le navigateur
    const previewUrl = URL.createObjectURL(file);
    setApercuLocal(previewUrl);
  };

  const declencherSelecteurFichier = () => {
    if (inputFichierRef.current) {
      inputFichierRef.current.click();
    }
  };

  const annulerFichierSelectionne = () => {
    if (apercuLocal) URL.revokeObjectURL(apercuLocal);
    setFichierImage(null);
    setApercuLocal(null);
    if (inputFichierRef.current) inputFichierRef.current.value = '';
  };

  // Drag & drop dans la zone d'upload
  const handleDragOver = (e) => {
    e.preventDefault();
    setGlissementFichier(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setGlissementFichier(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setGlissementFichier(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectionFichier(e.dataTransfer.files[0]);
    }
  };

  // ----------------------------------------------------------------------------
  // UPLOAD VERS LE BACKEND (POST /uploads)
  // ----------------------------------------------------------------------------
  const handleUploadImage = async () => {
    if (!fichierImage) {
      ajouterToast('Veuillez sélectionner ou déposer une image à uploader', 'attention');
      return;
    }

    setEnvoiUpload(true);
    const formData = new FormData();
    formData.append('file', fichierImage);

    try {
      const response = await axios.post(UPLOAD_ENDPOINT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const urlGeneree = response.data.url;
      const nouvelElement = {
        id: Date.now(),
        url: urlGeneree,
        nom: fichierImage.name,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Ajout de l'image en tête de la galerie
      setGalerie((precedents) => [nouvelElement, ...precedents]);
      annulerFichierSelectionne();
      setStatutApi('connecte');
      ajouterToast('Image uploadée avec succès sur le serveur !', 'succes');
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image :", error);
      ajouterToast("Échec de l'upload de l'image. Vérifiez le backend.", 'erreur');
    } finally {
      setEnvoiUpload(false);
    }
  };

  // ----------------------------------------------------------------------------
  // COPIER L'URL DANS LE PRESSE-PAPIER
  // ----------------------------------------------------------------------------
  const copierDansPressePapier = async (url) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Méthode de secours pour navigateurs anciens ou contextes sans https
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      setUrlCopiee(url);
      ajouterToast('URL copiée dans le presse-papier !', 'succes');
      setTimeout(() => setUrlCopiee(null), 2500);
    } catch (error) {
      console.error('Erreur de copie :', error);
      ajouterToast("Impossible de copier l'URL automatiquement", 'erreur');
    }
  };

  const supprimerDeLaGalerie = (id) => {
    setGalerie((precedents) => precedents.filter((item) => item.id !== id));
    ajouterToast('Image retirée de la galerie locale', 'info');
  };

  // ----------------------------------------------------------------------------
  // GESTION DU CLAVIER (ÉCHAP POUR FERMER LES MODALES)
  // ----------------------------------------------------------------------------
  useEffect(() => {
    const handleToucheClavier = (e) => {
      if (e.key === 'Escape') {
        if (serviceEnEdition) fermerModalEdition();
        if (serviceASupprimer) fermerModalSuppression();
      }
    };
    window.addEventListener('keydown', handleToucheClavier);
    return () => window.removeEventListener('keydown', handleToucheClavier);
  }, [serviceEnEdition, serviceASupprimer]);

  // Filtrage des services pour la recherche rapide
  const servicesFiltres = services.filter((s) => {
    const rechercheLower = recherche.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(rechercheLower)) ||
      (s.url && s.url.toLowerCase().includes(rechercheLower))
    );
  });

  return (
    <div className="app-layout">
      {/* TOASTS FLOTTANTS POUR LES NOTIFICATIONS */}
      <div className="toasts-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'succes' && (
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {toast.type === 'erreur' && (
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {toast.type === 'attention' && (
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {toast.type === 'info' && (
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => fermerToast(toast.id)}
              aria-label="Fermer la notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* HEADER PRINCIPAL AVEC LOGO & STATUT */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-logo">
            <span className="logo-letter">ODC</span>
          </div>
          <div className="brand-titles">
            <h1 className="main-title">ODC Campus</h1>
            <span className="brand-badge">ADMINISTRATION BACK OFFICE</span>
          </div>
        </div>

        <div className="header-actions">
          {/* Indicateur d'état du serveur backend NestJS */}
          <div
            className={`api-status-badge status-${statutApi}`}
            title={`Backend NestJS : ${API_BASE_URL}`}
          >
            <span className="status-dot"></span>
            <span className="status-text">
              {statutApi === 'connecte' && 'Serveur connecté (3000)'}
              {statutApi === 'erreur' && 'Serveur déconnecté'}
              {statutApi === 'verification' && 'Vérification API...'}
            </span>
          </div>

          <button
            className="btn-refresh"
            onClick={() => chargerServices()}
            title="Rafraîchir les données"
            disabled={chargementServices}
          >
            <svg
              className={chargementServices ? 'spinning' : ''}
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            <span>Actualiser</span>
          </button>
        </div>
      </header>

      {/* BARRE DE STATISTIQUES & NAVIGATION PAR ONGLETS */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon orange-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{services.length}</span>
            <span className="stat-label">Services Configurés</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{galerie.length}</span>
            <span className="stat-label">Photos Trombinoscope</span>
          </div>
        </div>

        <div className="tabs-nav">
          <button
            className={`tab-btn ${ongletActif === 'tous' ? 'active' : ''}`}
            onClick={() => setOngletActif('tous')}
          >
            Vue Complète
          </button>
          <button
            className={`tab-btn ${ongletActif === 'services' ? 'active' : ''}`}
            onClick={() => setOngletActif('services')}
          >
            Services App ({services.length})
          </button>
          <button
            className={`tab-btn ${ongletActif === 'trombinoscope' ? 'active' : ''}`}
            onClick={() => setOngletActif('trombinoscope')}
          >
            Trombinoscope ({galerie.length})
          </button>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <main className="dashboard-content">
        {/* SECTION 1 : GESTION DES SERVICES (CRUD COMPLET) */}
        {(ongletActif === 'tous' || ongletActif === 'services') && (
          <section className="dashboard-section services-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <div className="section-badge-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <div>
                  <h2 className="section-title">Gestion des Services Applicatifs</h2>
                  <p className="section-subtitle">
                    Configurez en temps réel les services consommés par l&apos;application Flutter.
                  </p>
                </div>
              </div>

              {/* Champ de recherche rapide */}
              <div className="search-box">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                />
                {recherche && (
                  <button className="clear-search-btn" onClick={() => setRecherche('')}>
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Formulaire d'ajout d'un nouveau service */}
            <form onSubmit={handleAjouterService} className="form-card add-service-form">
              <div className="form-card-title">
                <span>+ Ajouter un nouveau service</span>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="input-nom-service">Nom du service</label>
                  <input
                    id="input-nom-service"
                    type="text"
                    placeholder="Ex: Portail Formations, FabLab..."
                    value={nouveauService.name}
                    onChange={(e) =>
                      setNouveauService({ ...nouveauService, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="input-url-service">URL du service (Webview)</label>
                  <input
                    id="input-url-service"
                    type="text"
                    placeholder="Ex: https://odc.orange.com ou /chemin"
                    value={nouveauService.url}
                    onChange={(e) =>
                      setNouveauService({ ...nouveauService, url: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="input-action">
                  <button type="submit" className="btn btn-primary" disabled={envoiAjout}>
                    {envoiAjout ? (
                      <>
                        <span className="spinner-mini"></span> Enregistrement...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Ajouter le service
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Tableau élégant de la liste des services */}
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>Nom du Service</th>
                    <th>URL de Destination</th>
                    <th style={{ width: '220px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {chargementServices ? (
                    <tr>
                      <td colSpan="4" className="table-empty">
                        <div className="table-loader">
                          <span className="spinner"></span>
                          <span>Chargement des services depuis le serveur...</span>
                        </div>
                      </td>
                    </tr>
                  ) : servicesFiltres.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="table-empty">
                        <div className="empty-state">
                          <svg viewBox="0 0 24 24" width="48" height="48" stroke="#6B7280" fill="none" strokeWidth="1.5">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                          <p className="empty-title">
                            {recherche ? 'Aucun résultat correspondant à votre recherche' : 'Aucun service configuré pour le moment'}
                          </p>
                          <p className="empty-desc">
                            {recherche
                              ? 'Essayez de modifier votre mot-clé de recherche.'
                              : 'Utilisez le formulaire ci-dessus pour déclarer votre premier service applicatif.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    servicesFiltres.map((service, index) => {
                      const realIndex = services.findIndex(
                        (s) => s.name === service.name && s.url === service.url
                      );
                      const targetIndex = realIndex !== -1 ? realIndex : index;

                      return (
                        <tr key={`${service.name}-${index}`} className="table-row">
                          <td className="col-index">{targetIndex + 1}</td>
                          <td className="col-name">
                            <div className="service-name-cell">
                              <span className="service-badge-dot"></span>
                              <span className="service-title">{service.name}</span>
                            </div>
                          </td>
                          <td className="col-url">
                            <div className="service-url-cell">
                              <a
                                href={service.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="service-link"
                                title="Ouvrir le lien dans un nouvel onglet"
                              >
                                <span>{service.url}</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                              </a>
                            </div>
                          </td>
                          <td className="col-actions">
                            <div className="action-buttons">
                              <button
                                className="btn-action btn-edit"
                                onClick={() => ouvrirModalEdition(targetIndex)}
                                title="Modifier ce service"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                <span>Modifier</span>
                              </button>

                              <button
                                className="btn-action btn-delete"
                                onClick={() => demanderSuppression(targetIndex)}
                                title="Supprimer ce service"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  <line x1="10" y1="11" x2="10" y2="17" />
                                  <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SECTION 2 : GESTION DU TROMBINOSCOPE (UPLOAD & GALERIE) */}
        {(ongletActif === 'tous' || ongletActif === 'trombinoscope') && (
          <section className="dashboard-section trombi-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <div className="section-badge-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div>
                  <h2 className="section-title">Gestion du Trombinoscope & Médias</h2>
                  <p className="section-subtitle">
                    Téléversez les photos des apprenants et copiez instantanément l&apos;URL pour Flutter.
                  </p>
                </div>
              </div>
            </div>

            {/* Zone de Drag & Drop pour l'Upload */}
            <div
              className={`dropzone ${glissementFichier ? 'dropzone-active' : ''} ${apercuLocal ? 'has-preview' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={!apercuLocal ? declencherSelecteurFichier : undefined}
            >
              <input
                ref={inputFichierRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleSelectionFichier(e.target.files[0])}
                style={{ display: 'none' }}
              />

              {!apercuLocal ? (
                <div className="dropzone-content">
                  <div className="dropzone-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#FF7900" strokeWidth="2" width="44" height="44">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <h3 className="dropzone-title">
                    Glissez & déposez une image ici, ou <span>parcourez vos fichiers</span>
                  </h3>
                  <p className="dropzone-hint">
                    Formats acceptés : JPG, PNG, WebP, GIF (Max 10 Mo)
                  </p>
                </div>
              ) : (
                <div className="preview-container">
                  <div className="preview-image-box">
                    <img src={apercuLocal} alt="Prévisualisation locale" className="preview-img" />
                  </div>
                  <div className="preview-info">
                    <h4 className="preview-filename">{fichierImage?.name}</h4>
                    <p className="preview-filesize">
                      {(fichierImage?.size / (1024 * 1024)).toFixed(2)} Mo
                    </p>

                    <div className="preview-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleUploadImage}
                        disabled={envoiUpload}
                      >
                        {envoiUpload ? (
                          <>
                            <span className="spinner-mini"></span> Téléversement en cours...
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            Uploader sur le serveur
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={annulerFichierSelectionne}
                        disabled={envoiUpload}
                      >
                        Changer d&apos;image
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Galerie d'images uploadées */}
            <div className="gallery-container">
              <div className="gallery-header">
                <h3 className="gallery-title">
                  Galerie des médias hébergés ({galerie.length})
                </h3>
                <span className="gallery-subtitle">
                  Cliquez sur « Copier l&apos;URL » pour intégrer l&apos;image directement dans vos widgets Flutter.
                </span>
              </div>

              {galerie.length === 0 ? (
                <div className="gallery-empty">
                  <svg viewBox="0 0 24 24" width="40" height="40" stroke="#6B7280" fill="none" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p>Aucune image uploadée dans cette session.</p>
                  <span>Vos prochaines images uploadées s&apos;afficheront ici avec leur lien d&apos;accès direct.</span>
                </div>
              ) : (
                <div className="gallery-grid">
                  {galerie.map((item) => (
                    <div key={item.id} className="gallery-card">
                      <div className="gallery-img-wrap">
                        <img
                          src={item.url}
                          alt={item.nom || 'Photo Trombinoscope'}
                          className="gallery-img"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/300x200/1E1E1E/FF7900?text=Image+Indisponible';
                          }}
                        />
                        <div className="gallery-img-overlay">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-overlay-view"
                            title="Voir en taille réelle"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <circle cx="11" cy="11" r="8" />
                              <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              <line x1="11" y1="8" x2="11" y2="14" />
                              <line x1="8" y1="11" x2="14" y2="11" />
                            </svg>
                          </a>
                        </div>
                      </div>

                      <div className="gallery-card-info">
                        <div className="gallery-card-name" title={item.nom}>
                          {item.nom}
                        </div>
                        <div className="gallery-card-url" title={item.url}>
                          {item.url}
                        </div>

                        <div className="gallery-card-actions">
                          <button
                            className={`btn-copy ${urlCopiee === item.url ? 'btn-copy-success' : ''}`}
                            onClick={() => copierDansPressePapier(item.url)}
                            title="Copier l'URL complète pour Flutter"
                          >
                            {urlCopiee === item.url ? (
                              <>
                                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Copié !</span>
                              </>
                            ) : (
                              <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                <span>Copier l&apos;URL</span>
                              </>
                            )}
                          </button>

                          <button
                            className="btn-delete-item"
                            onClick={() => supprimerDeLaGalerie(item.id)}
                            title="Retirer de la galerie"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* MODALE DE MODIFICATION (UPDATE MODAL) */}
      {serviceEnEdition && (
        <div className="modal-overlay" onClick={fermerModalEdition}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span className="modal-icon orange-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </span>
                <h3 className="modal-title">Modifier le Service</h3>
              </div>
              <button className="modal-close" onClick={fermerModalEdition} aria-label="Fermer">
                ×
              </button>
            </div>

            <form onSubmit={handleSauvegarderEdition}>
              <div className="modal-body">
                <div className="input-group">
                  <label htmlFor="modal-service-name">Nom du service</label>
                  <input
                    id="modal-service-name"
                    type="text"
                    value={serviceEnEdition.name}
                    onChange={(e) =>
                      setServiceEnEdition({ ...serviceEnEdition, name: e.target.value })
                    }
                    placeholder="Nom du service"
                    required
                    autoFocus
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="modal-service-url">URL du service (Webview)</label>
                  <input
                    id="modal-service-url"
                    type="text"
                    value={serviceEnEdition.url}
                    onChange={(e) =>
                      setServiceEnEdition({ ...serviceEnEdition, url: e.target.value })
                    }
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={fermerModalEdition}
                  disabled={chargementModal}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={chargementModal}>
                  {chargementModal ? (
                    <>
                      <span className="spinner-mini"></span> Mise à jour...
                    </>
                  ) : (
                    'Enregistrer les modifications'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE DE CONFIRMATION DE SUPPRESSION (DELETE CONFIRMATION) */}
      {serviceASupprimer && (
        <div className="modal-overlay" onClick={fermerModalSuppression}>
          <div
            className="modal-container modal-danger"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span className="modal-icon danger-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </span>
                <h3 className="modal-title">Confirmer la suppression</h3>
              </div>
              <button className="modal-close" onClick={fermerModalSuppression} aria-label="Fermer">
                ×
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-confirm-text">
                Êtes-vous sûr de vouloir supprimer définitivement le service{' '}
                <strong className="text-orange">« {serviceASupprimer.name} »</strong> ?
              </p>
              <p className="modal-confirm-subtext">
                Cette action appliquera immédiatement la modification au backend NestJS et le service ne sera plus accessible depuis l&apos;application mobile Flutter.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={fermerModalSuppression}
                disabled={chargementModal}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmerSuppression}
                disabled={chargementModal}
              >
                {chargementModal ? (
                  <>
                    <span className="spinner-mini"></span> Suppression...
                  </>
                ) : (
                  'Confirmer la suppression'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="app-footer">
        <p>ODC Campus Admin Console • Orange Digital Center • Développé avec React & NestJS</p>
      </footer>
    </div>
  );
}

export default App;
