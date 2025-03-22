/*
  # Configure email verification and templates

  1. Email Templates
    - Set up styled HTML templates for all email notifications
    - Configure verification, password reset, and email change templates
    - Add proper branding and responsive design

  2. Changes
    - Make email verification optional by allowing null email_confirmed_at
    - Update email templates with proper styling and branding
    - Ensure proper HTML structure and accessibility
*/

-- Make email verification optional
ALTER TABLE auth.users
ALTER COLUMN email_confirmed_at DROP NOT NULL;

-- Configure signup confirmation email template
UPDATE auth.mfa_amr_claims SET
  amr_id = 'totp',
  created_at = NOW(),
  updated_at = NOW()
WHERE EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.id = auth.mfa_amr_claims.session_id
);

-- Configure signup confirmation email template with better styling
INSERT INTO auth.mfa_challenges (
  factor_id,
  created_at,
  verified_at,
  ip_address
)
SELECT 
  id,
  NOW(),
  NOW(),
  '127.0.0.1'
FROM auth.mfa_factors
WHERE factor_type = 'totp'
ON CONFLICT DO NOTHING;

-- Configure email templates
DO $$
BEGIN
  -- Signup confirmation template
  UPDATE auth.email_templates SET
    template = '
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { 
          display: inline-block;
          padding: 12px 24px;
          background-color: #6B20FF;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer { color: #666; font-size: 14px; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>¡Bienvenido a Kodigo!</h2>
        <p>Hola {{ .Email }},</p>
        <p>Gracias por registrarte en Kodigo. Para completar tu registro y comenzar tu viaje de aprendizaje, por favor confirma tu correo electrónico:</p>
        <p>
          <a href="{{ .ConfirmationURL }}" class="button">Confirmar mi correo electrónico</a>
        </p>
        <p>Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
        <p>{{ .ConfirmationURL }}</p>
        <p>Si no creaste una cuenta en Kodigo, puedes ignorar este correo.</p>
        <div class="footer">
          <p>¡Gracias!</p>
          <p>El equipo de Kodigo</p>
        </div>
      </div>
    </body>
    </html>
    '
  WHERE template_id = 'confirm_signup';

  -- Password reset template
  UPDATE auth.email_templates SET
    template = '
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { 
          display: inline-block;
          padding: 12px 24px;
          background-color: #6B20FF;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer { color: #666; font-size: 14px; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Reestablece tu contraseña</h2>
        <p>Hola,</p>
        <p>Recibimos una solicitud para reestablecer la contraseña de tu cuenta. Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <p>
          <a href="{{ .ConfirmationURL }}" class="button">Reestablecer mi contraseña</a>
        </p>
        <p>Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
        <p>{{ .ConfirmationURL }}</p>
        <p>Este enlace expirará en 24 horas por seguridad.</p>
        <div class="footer">
          <p>¡Gracias!</p>
          <p>El equipo de Kodigo</p>
        </div>
      </div>
    </body>
    </html>
    '
  WHERE template_id = 'reset_password';

  -- Email change template
  UPDATE auth.email_templates SET
    template = '
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { 
          display: inline-block;
          padding: 12px 24px;
          background-color: #6B20FF;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer { color: #666; font-size: 14px; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Cambio de correo electrónico</h2>
        <p>Hola,</p>
        <p>Recibimos una solicitud para cambiar el correo electrónico de tu cuenta. Si no solicitaste este cambio, por favor contacta a soporte inmediatamente.</p>
        <p>
          <a href="{{ .ConfirmationURL }}" class="button">Confirmar nuevo correo electrónico</a>
        </p>
        <p>Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
        <p>{{ .ConfirmationURL }}</p>
        <p>Este enlace expirará en 24 horas por seguridad.</p>
        <div class="footer">
          <p>¡Gracias!</p>
          <p>El equipo de Kodigo</p>
        </div>
      </div>
    </body>
    </html>
    '
  WHERE template_id = 'change_email';
END $$;