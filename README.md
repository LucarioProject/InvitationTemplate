# Invitacion de boda web

Plantilla profesional para invitacion de boda, lista para publicar en Railway.

## Ejecutar localmente

```bash
npm start
```

Por defecto abre en:

```text
http://localhost:8080
```

Railway usara automaticamente `process.env.PORT`.

## Personalizar

- Textos principales: `public/index.html`
- Fecha de la boda: `public/script.js`, variable `weddingDate`
- WhatsApp de confirmacion: `public/script.js`, variable `whatsappNumber`
- Colores y estilo: `public/styles.css`
- Imagen principal: `public/assets/couple-hero.png`
- Imagen de agradecimiento: `public/assets/gratitude.png`

## Publicar en Railway

1. Sube este proyecto a GitHub.
2. En Railway, crea un nuevo proyecto desde el repo.
3. Railway detecta Node y ejecuta `npm start`.
4. No necesitas variables de entorno obligatorias.

# InvitationTemplate
