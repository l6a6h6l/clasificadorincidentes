import React, { useState, useMemo } from 'react';
import { AlertCircle, CheckCircle, Database, TrendingUp, Search } from 'lucide-react';

const IncidentServicePredictor = () => {
  const [descripcion, setDescripcion] = useState('');
  const [predicciones, setPredicciones] = useState(null);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);

  // Sistema de predicción mejorado con 885 registros analizados
  const analizarDescripcion = (descripcion) => {
    const desc = descripcion.toUpperCase();
    const palabras = desc.split(/[\s,.:;()]+/).filter(p => p.length > 2);
    
    // Resultado inicial
    let resultado = {
      tipo: null,
      s1: null,
      s2: null,
      s3: null,
      confianza: 0,
      palabraClave: ''
    };

    // Patrones específicos con alta confianza (incluye nuevos de actividades programadas)
    const patronesEspecificos = {
      // SERVICIOS DE AUTORIZACIÓN
      'DATAFAST': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'DATAFAST', tipo: 'APLICATIVO', confianza: 0.95 },
      'BANRED': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'BANRED', tipo: 'APLICATIVO', confianza: 0.92 },
      'B24': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'B24', tipo: 'APLICATIVO', confianza: 0.94 },
      'JARDIN AZUAYO': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'JARDIN AZUAYO', tipo: 'APLICATIVO', confianza: 0.97 },
      'JARDÍN AZUAYO': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'JARDÍN AZUAYO', tipo: 'APLICATIVO', confianza: 0.97 },
      'CAO': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'CAO', tipo: 'APLICATIVO', confianza: 0.95 },
      'PAGO DIRECTO': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'BANRED', tipo: 'APLICATIVO', confianza: 0.95 },
      
      // TARJETAS DE CRÉDITO
      'VISA': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'VISA', tipo: 'APLICATIVO', confianza: 0.85 },
      'MASTERCARD': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'MASTERCARD', tipo: 'APLICATIVO', confianza: 0.90 },
      
      // SERVICIOS MUNICIPALES
      'MUNICIPIO': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'BOTON DE PAGOS NUEVO', tipo: 'APLICATIVO', confianza: 0.94 },
      'GUAYAQUIL': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'BOTON DE PAGOS NUEVO', tipo: 'APLICATIVO', confianza: 0.94 },
      
      // SERVICIOS TRANSACCIONALES
      'CNEL': { s1: 'TRANSACCIONAL', s2: 'GESTOR', s3: 'CNEL', tipo: 'APLICATIVO', confianza: 0.9 },
      
      // SERVICIOS DE CANALES
      'PEOPLE SOFT': { s1: 'CANALES', s2: 'PEOPLE SOFT', s3: 'PEOPLE SOFT', tipo: 'APLICATIVO', confianza: 0.94 },
      'AVANTI': { s1: 'CANALES', s2: 'CANAL_DIGITAL', s3: 'ONBOARDING', tipo: 'APLICATIVO', confianza: 0.91 },
      
      // SERVICIOS WEB Y WEBID
      'WEBID': { s1: 'WEB', s2: 'WEBID', s3: 'SMS', tipo: 'APLICATIVO', confianza: 0.90 },
      'WAS': { s1: 'WEB', s2: 'WEBID', s3: 'WEBID', tipo: 'APLICATIVO', confianza: 0.85 },
      
      // SERVIDORES Y BROKERS (NUEVO)
      'BROKER': { s1: 'CANALES', s2: 'APP WEB', s3: 'APP MOVIL', tipo: 'SERVIDORES', confianza: 0.95 },
      'BROKERS': { s1: 'CANALES', s2: 'APP WEB', s3: 'APP MOVIL', tipo: 'SERVIDORES', confianza: 0.95 },
      'PAGING': { s1: 'CANALES', s2: 'APP WEB', s3: 'APP MOVIL', tipo: 'SERVIDORES', confianza: 0.95 },
      
      // DEPURACIÓN Y MANTENIMIENTO (NUEVO)
      'DEPURACION': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'TODOS LOS SERVICIOS', tipo: 'APLICATIVO', confianza: 1.0 },
      'DEPURACIÓN': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'TODOS LOS SERVICIOS', tipo: 'APLICATIVO', confianza: 1.0 },
      
      // COMUNICACIONES
      'REGISTRO CIVIL': { s1: 'CANALES', s2: 'BILLETERA', s3: 'BILLETERA DINERS', tipo: 'COMUNICACIONES', confianza: 0.87 },
      'VPN': { s1: 'CANALES', s2: 'CANALES', s3: 'VPN', tipo: 'COMUNICACIONES', confianza: 0.95 },
      
      // PASARELAS DE PAGO
      'PLACE TO PAY': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'PLACE TO PAY', tipo: 'COMUNICACIONES', confianza: 0.9 },
      'PAYMENTEZ': { s1: 'AUTORIZACIONES', s2: 'CENTRO AUTORIZADOR', s3: 'PAYMENTEZ', tipo: 'COMUNICACIONES', confianza: 0.9 }
    };

    // 1. Buscar patrones específicos
    for (const [patron, config] of Object.entries(patronesEspecificos)) {
      if (desc.includes(patron)) {
        // Ajustar servicio 3 para WEBID según contexto
        if (patron === 'WEBID' || patron === 'WAS') {
          if (desc.includes('SMS')) config.s3 = 'SMS';
          else if (desc.includes('BOTON') || desc.includes('PAGO')) config.s3 = 'BOTÓN DE PAGOS';
          else if (desc.includes('CERTIFICADO')) config.s3 = 'CERTIFICADOS';
          else if (desc.includes('MAIL') || desc.includes('CORREO')) config.s3 = 'MAIL';
        }
        
        resultado = { ...config, palabraClave: patron };
        return resultado;
      }
    }

    // 1.5 Buscar combinaciones específicas
    if ((desc.includes('REINICIO') || desc.includes('RESTART')) && 
        (desc.includes('SERVIDOR') || desc.includes('SERVER'))) {
      return {
        tipo: 'SERVIDORES',
        s1: 'CANALES',
        s2: 'APP WEB',
        s3: 'APP MOVIL',
        confianza: 0.85,
        palabraClave: 'REINICIO_SERVIDOR'
      };
    }

    // MIGRACION tiene patrones especiales
    if (desc.includes('MIGRACION') || desc.includes('MIGRACIÓN')) {
      if (desc.includes('BASE') && desc.includes('DATOS')) {
        return {
          tipo: 'SERVIDORES',
          s1: 'TRANSACCIONAL',
          s2: 'GESTOR',
          s3: 'BASE DATOS',
          confianza: 0.8,
          palabraClave: 'MIGRACION_BD'
        };
      } else if (desc.includes('SERVIDOR')) {
        return {
          tipo: 'SERVIDORES',
          s1: 'ADMINISTRATIVO',
          s2: 'INFRAESTRUCTURA',
          s3: 'SERVIDORES',
          confianza: 0.75,
          palabraClave: 'MIGRACION_SERVIDOR'
        };
      } else {
        return {
          tipo: 'SERVIDORES',
          s1: 'WEB',
          s2: 'WEB',
          s3: 'SERVIDORES',
          confianza: 0.62,
          palabraClave: 'MIGRACION'
        };
      }
    }

    // 2. Análisis por términos técnicos
    const terminosTecnicos = {
      COMUNICACIONES: ['VLAN', 'VLANS', 'VPN', 'RED', 'SWITCH', 'ROUTER', 'FIREWALL', 'PUERTO', 
                      'ENLACE', 'ANCHO', 'BANDA', 'LATENCIA', 'TCP', 'UDP', 'IP', 'DNS', 'GATEWAY', 
                      'PROXY', 'BALANCEADOR', 'CONECTIVIDAD', 'SMS', 'CORREO', 'EMAIL'],
      SERVIDORES: ['SERVIDOR', 'CPU', 'MEMORIA', 'RAM', 'DISCO', 'STORAGE', 'VIRTUAL', 'VM', 
                   'CLUSTER', 'DATACENTER', 'BACKUP', 'BROKER', 'BROKERS', 'PAGING', 'CONSUMO', 
                   'REINICIO', 'RESTART', 'INFRAESTRUCTURA'],
      APLICATIVO: ['APP', 'APLICACION', 'SOFTWARE', 'PORTAL', 'WEB', 'TRANSACCION', 'AUTORIZACION', 
                   'AUTENTICACION', 'LOGIN', 'SESION', 'BANCA', 'MULTICANALIDAD', 'WEBID', 'WAS', 
                   'DEPURACION', 'ACTUALIZACION']
    };

    let maxScore = 0;
    let tipoDetectado = null;
    let palabrasEncontradas = [];

    for (const [tipo, terminos] of Object.entries(terminosTecnicos)) {
      let score = 0;
      for (const termino of terminos) {
        if (desc.includes(termino)) {
          score += 0.3;
          palabrasEncontradas.push(termino);
        }
      }
      if (score > maxScore) {
        maxScore = score;
        tipoDetectado = tipo;
      }
    }

    // 3. Asignar servicios según tipo detectado con lógica de cascada
    if (tipoDetectado) {
      resultado.tipo = tipoDetectado;
      resultado.confianza = Math.min(0.95, maxScore);
      resultado.palabraClave = palabrasEncontradas.slice(0, 3).join(', ') || 'ANÁLISIS CONTEXTUAL';

      // Lógica de cascada de impacto
      if (tipoDetectado === 'COMUNICACIONES') {
        resultado.s1 = 'CANALES'; // Usuarios más afectados
        if (desc.includes('SMS')) {
          resultado.s2 = 'WEBID';
          resultado.s3 = 'SMS';
        } else if (desc.includes('VPN')) {
          resultado.s2 = 'CANALES';
          resultado.s3 = 'VPN';
        } else if (desc.includes('VLAN') || desc.includes('SWITCH')) {
          resultado.s2 = 'RED';
          resultado.s3 = 'RED';
        } else {
          resultado.s2 = 'RED';
          resultado.s3 = 'FIREWALL';
        }
      } else if (tipoDetectado === 'SERVIDORES') {
        resultado.s1 = 'TRANSACCIONAL'; // Transacciones afectadas
        resultado.s2 = 'GESTOR';
        resultado.s3 = 'SERVIDORES';
      } else if (tipoDetectado === 'APLICATIVO') {
        if (desc.includes('AUTORIZACION') || desc.includes('TRANSACCION')) {
          resultado.s1 = 'AUTORIZACIONES';
          resultado.s2 = 'CENTRO AUTORIZADOR';
          resultado.s3 = 'CENTRO AUTORIZADOR';
        } else if (desc.includes('BANCA')) {
          resultado.s1 = 'BANCA';
          resultado.s2 = 'PORTAL_BANCA';
          resultado.s3 = 'BANCA';
        } else {
          resultado.s1 = 'CANALES';
          resultado.s2 = 'WEB';
          resultado.s3 = 'WEB';
        }
      }
    } else {
      // Valores por defecto
      resultado = {
        tipo: 'APLICATIVO',
        s1: 'CANALES',
        s2: 'WEB',
        s3: 'WEB',
        confianza: 0.3,
        palabraClave: 'GENERAL'
      };
    }

    return resultado;
  };

  const handlePredict = () => {
    if (descripcion.trim()) {
      const resultado = analizarDescripcion(descripcion);
      setPredicciones({
        servicio1: [{ nombre: resultado.s1, confianza: Math.round(resultado.confianza * 100) }],
        servicio2: [{ nombre: resultado.s2, confianza: Math.round(resultado.confianza * 100) }],
        servicio3: [{ nombre: resultado.s3, confianza: Math.round(resultado.confianza * 85) }],
        tipoComponente: [{ nombre: resultado.tipo, confianza: Math.round(resultado.confianza * 95) }],
        palabraClave: resultado.palabraClave
      });
    }
  };

  const estadisticas = {
    totalIncidentes: 885,
    serviciosMasFrecuentes: {
      servicio1: [
        { nombre: 'AUTORIZACIONES', cantidad: 329, porcentaje: 51 },
        { nombre: 'CANALES', cantidad: 129, porcentaje: 20 },
        { nombre: 'TRANSACCIONAL', cantidad: 67, porcentaje: 10 }
      ],
      servicio2: [
        { nombre: 'CENTRO AUTORIZADOR', cantidad: 327, porcentaje: 51 },
        { nombre: 'GESTOR', cantidad: 63, porcentaje: 10 },
        { nombre: 'WEBID', cantidad: 50, porcentaje: 8 }
      ],
      servicio3: [
        { nombre: 'CNEL', cantidad: 57, porcentaje: 9 },
        { nombre: 'B24', cantidad: 53, porcentaje: 8 },
        { nombre: 'BOTON DE PAGOS NUEVO', cantidad: 48, porcentaje: 7 }
      ]
    },
    patronesActividades: [
      { nombre: 'DEPURACIÓN CAO', confianza: 100 },
      { nombre: 'BROKER/PAGING', confianza: 95 },
      { nombre: 'JARDÍN AZUAYO', confianza: 97 },
      { nombre: 'WEBID', confianza: 90 }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Database className="text-blue-600" />
          Clasificador Inteligente de Incidentes v2.0
        </h1>
        <p className="text-gray-600">
          Basado en el análisis de {estadisticas.totalIncidentes} registros (645 incidentes + 240 actividades programadas)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Search className="text-green-600" />
          Ingrese la descripción del incidente
        </h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
          placeholder="Ejemplos: 
- INTERMITENCIAS EN EL ACCESO A MULTICANALIDAD WEB
- REINICIO SERVIDOR BROKERS POR ALTO CONSUMO DE PAGING
- DEPURACIÓN DEL CAO SIN OPCIÓN
- MIGRACIÓN BASE DE DATOS ORACLE
- PROBLEMAS CON VLANS EN SWITCH PRINCIPAL"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button
          onClick={handlePredict}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Predecir Servicios
        </button>
      </div>

      {predicciones && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-600" />
            Predicciones Sugeridas
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-medium text-red-800 mb-2">🔴 Servicio 1 - Mayor Impacto</h3>
                <p className="text-lg font-semibold text-red-900">
                  {predicciones.servicio1[0].nombre}
                </p>
                <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${predicciones.servicio1[0].confianza}%` }}
                  />
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Confianza: {predicciones.servicio1[0].confianza}%
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-medium text-yellow-800 mb-2">🟡 Servicio 2 - Impacto Secundario</h3>
                <p className="text-lg font-semibold text-yellow-900">
                  {predicciones.servicio2[0].nombre}
                </p>
                <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${predicciones.servicio2[0].confianza}%` }}
                  />
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Confianza: {predicciones.servicio2[0].confianza}%
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-medium text-green-800 mb-2">🟢 Servicio 3 - Impacto Terciario</h3>
                <p className="text-lg font-semibold text-green-900">
                  {predicciones.servicio3[0].nombre}
                </p>
                <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${predicciones.servicio3[0].confianza}%` }}
                  />
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Confianza: {predicciones.servicio3[0].confianza}%
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-medium text-orange-800 mb-2">Tipo de Componente</h3>
                <p className="text-lg font-semibold text-orange-900">
                  {predicciones.tipoComponente[0].nombre}
                </p>
                <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${predicciones.tipoComponente[0].confianza}%` }}
                  />
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  Confianza: {predicciones.tipoComponente[0].confianza}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Palabra clave detectada:</span> {predicciones.palabraClave}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Lógica aplicada:</span> Los servicios se ordenan por nivel de impacto (cascada)
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={() => setMostrarEstadisticas(!mostrarEstadisticas)}
          className="flex items-center gap-2 text-lg font-semibold mb-4 hover:text-blue-600 transition-colors"
        >
          <TrendingUp className="text-blue-600" />
          {mostrarEstadisticas ? 'Ocultar' : 'Mostrar'} Estadísticas del Modelo
        </button>
        
        {mostrarEstadisticas && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Servicios Más Frecuentes</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Servicio 1</h4>
                  {estadisticas.serviciosMasFrecuentes.servicio1.map((s, i) => (
                    <div key={i} className="flex justify-between text-sm mb-1">
                      <span>{s.nombre}</span>
                      <span className="text-gray-500">{s.porcentaje}%</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Servicio 2</h4>
                  {estadisticas.serviciosMasFrecuentes.servicio2.map((s, i) => (
                    <div key={i} className="flex justify-between text-sm mb-1">
                      <span>{s.nombre}</span>
                      <span className="text-gray-500">{s.porcentaje}%</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Servicio 3</h4>
                  {estadisticas.serviciosMasFrecuentes.servicio3.map((s, i) => (
                    <div key={i} className="flex justify-between text-sm mb-1">
                      <span>{s.nombre}</span>
                      <span className="text-gray-500">{s.porcentaje}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Nuevos Patrones de Actividades Programadas</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {estadisticas.patronesActividades.map((patron, i) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 p-3 rounded">
                    <span className="font-medium">{patron.nombre}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full"
                        style={{ width: `${patron.confianza}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{patron.confianza}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Mejoras en v2.0:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>+240 actividades programadas analizadas</li>
              <li>Detección mejorada de BROKER, PAGING, DEPURACIÓN</li>
              <li>Patrones específicos para WEBID, WAS, JARDÍN AZUAYO</li>
              <li>Lógica de migración inteligente</li>
              <li>Detección de reinicio de servidores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentServicePredictor;
