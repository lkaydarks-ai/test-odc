import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  createConfiguration,
  deleteConfiguration,
  getConfiguration,
  getConfigurations,
  updateConfiguration,
} from '../api/configuration';
import type { ConfigStatus, Configuration } from '../types/configurations';

type Notification = {
  message: string;
  severity: 'success' | 'error';
};

const extractError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Impossible de joindre le backend. Vérifiez qu’il est démarré sur le port 3000.';
    }

    const message: unknown = error.response.data?.message;
    if (Array.isArray(message)) return message.join(' · ');
    if (typeof message === 'string') return message;
    return error.message;
  }

  return error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
};

const parseJsonObject = (text: string): Record<string, unknown> => {
  const parsed: unknown = JSON.parse(text);
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Le JSON doit être un objet, par exemple : { "name": "DevOps" }.');
  }
  return parsed as Record<string, unknown>;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const pretty = (value: unknown) => JSON.stringify(value, null, 2);

export default function ConfigurationPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const [newKey, setNewKey] = useState('');
  const [newJson, setNewJson] = useState('{\n  \n}');
  const [newStatus, setNewStatus] = useState<ConfigStatus>('active');

  const [selected, setSelected] = useState<Configuration | null>(null);
  const [editJson, setEditJson] = useState('');
  const [editStatus, setEditStatus] = useState<ConfigStatus>('active');
  const [deleteTarget, setDeleteTarget] = useState<Configuration | null>(null);

  const loadConfigurations = useCallback(async () => {
    try {
      setConfigurations(await getConfigurations());
    } catch (error) {
      setNotification({ message: extractError(error), severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getConfigurations()
      .then((items) => {
        if (active) setConfigurations(items);
      })
      .catch((error: unknown) => {
        if (active) {
          setNotification({ message: extractError(error), severity: 'error' });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const key = newKey.trim();
      await createConfiguration({
        key,
        value: parseJsonObject(newJson),
        status: newStatus,
      });
      setNewKey('');
      setNewJson('{\n  \n}');
      setNewStatus('active');
      setNotification({
        message: `La configuration « ${key} » a été créée.`,
        severity: 'success',
      });
      setLoading(true);
      void loadConfigurations();
    } catch (error) {
      setNotification({
        message:
          error instanceof SyntaxError
            ? `JSON invalide : ${error.message}`
            : extractError(error),
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = async (key: string) => {
    try {
      const configuration = await getConfiguration(key);
      setSelected(configuration);
      setEditJson(pretty(configuration.value));
      setEditStatus(configuration.status);
    } catch (error) {
      setNotification({ message: extractError(error), severity: 'error' });
    }
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;

    setSaving(true);
    try {
      const updated = await updateConfiguration(selected.key, {
        value: parseJsonObject(editJson),
        status: editStatus,
      });
      setSelected(updated);
      setNotification({
        message: `La configuration « ${updated.key} » a été mise à jour.`,
        severity: 'success',
      });
      setLoading(true);
      void loadConfigurations();
    } catch (error) {
      setNotification({
        message:
          error instanceof SyntaxError
            ? `JSON invalide : ${error.message}`
            : extractError(error),
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const { key } = deleteTarget;
      await deleteConfiguration(key);
      setDeleteTarget(null);
      if (selected?.key === key) setSelected(null);
      setNotification({
        message: `La configuration « ${key} » a été supprimée.`,
        severity: 'success',
      });
      setLoading(true);
      void loadConfigurations();
    } catch (error) {
      setNotification({ message: extractError(error), severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const renderActions = (configuration: Configuration) => (
    <Stack
      direction="row"
      spacing={1}
      sx={{ flexWrap: 'wrap', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}
    >
      <Button
        variant="outlined"
        size="small"
        startIcon={<EditOutlinedIcon />}
        onClick={() => void handleSelect(configuration.key)}
        sx={{ minHeight: 40 }}
      >
        Voir / Modifier
      </Button>
      <Button
        variant="outlined"
        color="error"
        size="small"
        startIcon={<DeleteOutlineIcon />}
        onClick={() => setDeleteTarget(configuration)}
        sx={{ minHeight: 40 }}
      >
        Supprimer
      </Button>
    </Stack>
  );

  return (
    <Box component="main" sx={{ minHeight: '100vh', py: { xs: 3, sm: 5 } }}>
      <Box sx={{ maxWidth: 1120, mx: 'auto', px: { xs: 2, sm: 3 } }}>
        <Stack spacing={0.75} sx={{ mb: 4 }}>
          <Typography variant="overline" color="primary.main" fontWeight={700}>
            Administration
          </Typography>
          <Typography component="h1" variant="h4" fontWeight={700}>
            Configurations
          </Typography>
          <Typography color="text.secondary">
            Gérez les paramètres et leur disponibilité dans votre environnement.
          </Typography>
        </Stack>

        <Paper component="section" variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Stack spacing={2.5} component="form" onSubmit={handleCreate}>
            <Box>
              <Typography component="h2" variant="h6" fontWeight={600}>
                Nouvelle configuration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ajoutez une configuration au registre.
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  label="Clé"
                  placeholder="ex. programs.devops"
                  value={newKey}
                  onChange={(event) => setNewKey(event.target.value)}
                  required
                  fullWidth
                  inputProps={{ maxLength: 255 }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="new-status-label">Statut</InputLabel>
                  <Select
                    labelId="new-status-label"
                    label="Statut"
                    value={newStatus}
                    onChange={(event) => setNewStatus(event.target.value as ConfigStatus)}
                  >
                    <MenuItem value="active">Actif</MenuItem>
                    <MenuItem value="inactive">Inactif</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Valeur JSON"
                  value={newJson}
                  onChange={(event) => setNewJson(event.target.value)}
                  required
                  fullWidth
                  multiline
                  minRows={4}
                  maxRows={12}
                  slotProps={{ htmlInput: { spellCheck: false } }}
                  sx={{
                    '& textarea': {
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Box>
              <Button type="submit" variant="contained" disabled={saving} sx={{ minHeight: 44 }}>
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Créer la configuration'}
              </Button>
            </Box>
          </Stack>
        </Paper>

        <Paper component="section" variant="outlined" sx={{ overflow: 'hidden' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{ px: { xs: 2, sm: 3 }, py: 2 }}
          >
            <Box>
              <Typography component="h2" variant="h6" fontWeight={600}>
                Registre des configurations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {configurations.length} configuration{configurations.length === 1 ? '' : 's'}
              </Typography>
            </Box>
            {loading && <CircularProgress size={22} aria-label="Chargement des configurations" />}
          </Stack>

          {isMobile ? (
            <Stack spacing={1.5} sx={{ px: 2, pb: 2 }}>
              {!loading && configurations.length === 0 && (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  Aucune configuration pour le moment.
                </Typography>
              )}
              {configurations.map((configuration) => (
                <Paper key={configuration._id} variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={1.5}>
                    <Typography
                      component="code"
                      sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', overflowWrap: 'anywhere' }}
                    >
                      {configuration.key}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Chip
                        size="small"
                        label={configuration.status === 'active' ? 'Actif' : 'Inactif'}
                        color={configuration.status === 'active' ? 'success' : 'default'}
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(configuration.createdAt)}
                      </Typography>
                    </Stack>
                    {renderActions(configuration)}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <TableContainer>
              <Table aria-label="Liste des configurations">
                <TableHead>
                  <TableRow>
                    <TableCell>Clé</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Date de création</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading && configurations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                        Aucune configuration pour le moment.
                      </TableCell>
                    </TableRow>
                  )}
                  {configurations.map((configuration) => (
                    <TableRow key={configuration._id} hover>
                      <TableCell>
                        <Box
                          component="code"
                          sx={{
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {configuration.key}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={configuration.status === 'active' ? 'Actif' : 'Inactif'}
                          color={configuration.status === 'active' ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDate(configuration.createdAt)}</TableCell>
                      <TableCell align="right">{renderActions(configuration)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      <Dialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        aria-labelledby="configuration-dialog-title"
      >
        <Box component="form" onSubmit={handleUpdate}>
          <DialogTitle id="configuration-dialog-title" sx={{ pb: 0.5 }}>
            Modifier la configuration
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              {selected && (
                <>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Clé
                    </Typography>
                    <Typography component="code" sx={{ overflowWrap: 'anywhere' }}>
                      {selected.key}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                      Créée le {formatDate(selected.createdAt)} · Modifiée le{' '}
                      {formatDate(selected.updatedAt)}
                    </Typography>
                  </Box>
                  <TextField
                    label="Valeur JSON"
                    value={editJson}
                    onChange={(event) => setEditJson(event.target.value)}
                    required
                    fullWidth
                    multiline
                    minRows={8}
                    maxRows={18}
                    slotProps={{ htmlInput: { spellCheck: false } }}
                    sx={{
                      '& textarea': {
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      },
                    }}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="edit-status-label">Statut</InputLabel>
                    <Select
                      labelId="edit-status-label"
                      label="Statut"
                      value={editStatus}
                      onChange={(event) => setEditStatus(event.target.value as ConfigStatus)}
                    >
                      <MenuItem value="active">Actif</MenuItem>
                      <MenuItem value="inactive">Inactif</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setSelected(null)} color="inherit">
              Annuler
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Enregistrer'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Supprimer la configuration ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cette action supprimera définitivement{' '}
            <Box component="strong" sx={{ overflowWrap: 'anywhere' }}>
              {deleteTarget?.key}
            </Box>
            .
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteTarget(null)} color="inherit" disabled={deleting}>
            Annuler
          </Button>
          <Button
            onClick={() => void handleDelete()}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={!deleting && <DeleteOutlineIcon />}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification !== null}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={(_, reason) => {
          if (reason !== 'clickaway') setNotification(null);
        }}
      >
        {notification ? (
          <Alert
            severity={notification.severity}
            variant="filled"
            onClose={() => setNotification(null)}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
