const STORAGE_KEY = 'yamaha_tareas_operativas_v16';
export const TAREAS_DIARIAS_EVENT = 'yamaha:tareas-diarias-actualizadas';

export function leerTareasDiarias() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);

    if (!guardado) {
      return [];
    }

    const parsed = JSON.parse(guardado);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('No se pudieron leer las tareas diarias:', error);
    return [];
  }
}

export function guardarTareasDiarias(tareas) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tareas)
    );

    window.dispatchEvent(
      new Event(TAREAS_DIARIAS_EVENT)
    );
  } catch (error) {
    console.error('No se pudieron guardar las tareas diarias:', error);
  }
}

export function crearIdTareaDiaria() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `td_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}
