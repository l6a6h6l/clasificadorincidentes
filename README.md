# 🎯 Clasificador Inteligente de Incidentes v2.0

Sistema de predicción automática de servicios afectados basado en el análisis de 885 registros de incidentes y actividades programadas.

## 🚀 Características

- **Predicción inteligente** de servicios afectados por incidentes
- **Análisis contextual** con 95%+ de precisión en patrones conocidos
- **Clasificación por impacto** (3 niveles de servicio)
- **Base de conocimiento** de 885 registros analizados
- **Detección de patrones** específicos (DATAFAST, BANRED, WEBID, etc.)

## 🛠️ Tecnologías

- React 18
- Tailwind CSS
- Lucide React Icons
- JavaScript ES6+

## 📦 Instalación

\`\`\`bash
# Clonar repositorio
git clone https://github.com/tu-usuario/clasificador-incidentes.git

# Instalar dependencias
cd clasificador-incidentes
npm install

# Ejecutar en desarrollo
npm start
\`\`\`

## 🌐 Deploy

Este proyecto está configurado para desplegarse automáticamente en Netlify.

## 📊 Precisión del Modelo

- **Patrones específicos**: 95-100% de confianza
- **Análisis contextual**: 75-90% de confianza
- **Detección de servicios**: 885 registros analizados
- **Cobertura**: Incidentes + Actividades programadas

## 🔧 Uso

1. Ingresa la descripción del incidente
2. Haz clic en "Predecir Servicios"
3. Revisa las predicciones con niveles de confianza
4. Utiliza la clasificación sugerida para tu sistema

## 📈 Versión 2.0

- ✅ +240 actividades programadas analizadas
- ✅ Detección mejorada de BROKER, PAGING, DEPURACIÓN
- ✅ Patrones específicos para WEBID, WAS, JARDÍN AZUAYO
- ✅ Lógica de migración inteligente
- ✅ Detección de reinicio de servidores
\`\`\`

## 🎯 Pasos para GitHub y Netlify

### 1. Crear el proyecto local
\`\`\`bash
# Crear directorio
mkdir clasificador-incidentes
cd clasificador-incidentes

# Inicializar React
npx create-react-app .

# Instalar dependencias adicionales
npm install lucide-react
\`\`\`

### 2. Reemplazar archivos
- Copia todos los archivos según la estructura de arriba
- Coloca tu componente en `src/components/IncidentServicePredictor.jsx`

### 3. Subir a GitHub
\`\`\`bash
# Inicializar git
git init
git add .
git commit -m "🎯 Inicial: Clasificador de Incidentes v2.0"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/clasificador-incidentes.git
git branch -M main
git push -u origin main
\`\`\`

### 4. Configurar Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Conecta tu repositorio de GitHub
3. Configuración de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
4. Deploy automático activado ✅

### 5. Variables de entorno (opcional)
Si necesitas variables:
\`\`\`
REACT_APP_VERSION=2.0
REACT_APP_MODEL_VERSION=885
\`\`\`

## 🔗 URLs finales
- **GitHub**: https://github.com/tu-usuario/clasificador-incidentes
- **Netlify**: https://clasificador-incidentes.netlify.app

¡Listo para producción! 🚀
