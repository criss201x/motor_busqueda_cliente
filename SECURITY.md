# Guía de Seguridad

## 🔐 Manejo de Credenciales y Secretos

### Variables de Entorno Locales

1. **Nunca** commitees archivos `.env` con credenciales reales
2. Usa el archivo `.env.example` como plantilla
3. Todas las variables de entorno deben estar en el `.gitignore`

### Configuración de Secretos en GitHub Actions

Para que el CI/CD funcione correctamente con credenciales seguras:

#### Paso 1: Agregar Secretos en GitHub

1. Ve a tu repositorio en GitHub
2. Navega a `Settings` → `Secrets and variables` → `Actions`
3. Click en `New repository secret`
4. Agrega cada secreto con su valor correspondiente

#### Paso 2: Secretos Requeridos para el CI/CD

Los siguientes secretos ya están configurados para Firebase Hosting:

- `FIREBASE_SERVICE_ACCOUNT_HORARIOS_Y_ESPACIOS_FACT_TECNO` - Cuenta de servicio para deploy

#### Paso 3: Usar Variables de Entorno en GitHub Actions

Si necesitas agregar más variables de entorno en el futuro, edita los workflows en `.github/workflows/`:

```yaml
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci && npm run build
        env:
          # Agrega tus variables de entorno aquí
          VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
          VITE_PROJECT_ID: ${{ secrets.VITE_PROJECT_ID }}
```

### 🚨 IMPORTANTE: Credenciales Expuestas

**Si ya commiteaste credenciales al repositorio:**

1. **REVOCA inmediatamente** las credenciales expuestas desde la consola de Firebase
2. Genera nuevas credenciales
3. Agrega las nuevas credenciales como secretos de GitHub
4. (Opcional) Limpia el historial de Git:
   ```bash
   # CUIDADO: Esto reescribe el historial
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch src/firebase.js" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Forzar el push
   git push origin --force --all
   ```

### Estado Actual

✅ **El proyecto ya NO usa Firebase Database** - Los datos se cargan desde un archivo JSON local  
✅ **Las credenciales de Firebase en `firebase.js` ya no se utilizan** - El archivo puede ser eliminado  
✅ **El CI/CD usa Firebase Hosting** - Las credenciales están como secretos de GitHub  

### Recomendaciones

1. **Elimina el archivo `src/firebase.js`** - Ya no se usa
2. **Revoca las credenciales** viejas de Firebase Database desde la consola
3. **Mantén el `.gitignore` actualizado** para proteger futuros secretos
4. **Usa variables de entorno** para cualquier configuración sensible en el futuro

## 📚 Recursos Adicionales

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/get-started)
- [OWASP Security Cheat Sheet](https://cheatsheetseries.owasp.org/)
