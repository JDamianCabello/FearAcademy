<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>DovahNDo — The Fear Academy</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Sora:wght@200;300;400;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="styles.css?v=8" />
</head>
<body>

<!-- ================= NAV ================= -->
<nav class="nav" id="nav">
  <a class="brand" href="#top">
    <span class="mark">D</span>
    <span class="name">Dovah<span>N</span>Do</span>
  </a>
  <div class="nav-links">
    <a href="#escalera">Escalera</a>
    <a href="#teorias">Teorías</a>
    <a href="#maestro">Maestro</a>
    <a href="#prueba">Prueba</a>
    <a href="#acceso">Acceso</a>
  </div>
  <a class="nav-cta" href="#acceso">Entrar · gratis</a>
</nav>

<!-- ================= HERO ================= -->
<header class="hero" id="top">
  <div class="hero-sticky">
    <canvas id="hero-canvas"></canvas>
    <div class="hero-veil"></div>
    <div class="hero-inner" id="hero-inner">
      <div class="shell">
        <span class="eyebrow">// Academia de alto rendimiento · Est. MMXVIII</span>
        <audio data-charm-audio src="uploads/charm.aac" preload="auto"></audio>
        <h1 class="display">
          The Fear<br />
          <span class="line2">Academy</span>
        </h1>
        <p class="sub">No entrenamos jugadores. Forjamos la versión de ti que tus rivales <span class="gold-em">aprenderán a temer</span> — empezando por la que ves en el espejo cada derrota.</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#acceso">Entrar — es gratis <span class="arrow">→</span></a>
          <a class="btn btn-ghost" href="#escalera">Ver el método</a>
        </div>
      </div>
    </div>
    <div class="hero-reveal" id="hero-reveal">
      <span class="eyebrow">// Ella ya estaba ahí</span>
      <div class="hero-reveal-name">EVELYNN</div>
      <p>La agonía que no viste venir. En el arbusto, paciente, esperando tu error.</p>
    </div>
    <div class="hero-meta">
      <div class="shell">
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="n"><b>+412</b> LP</div>
            <div class="l">Media por alumno / split</div>
          </div>
          <div class="hero-stat">
            <div class="n"><b>9.4</b>/10</div>
            <div class="l">Suben de división</div>
          </div>
          <div class="hero-stat">
            <div class="n"><b>2,800</b></div>
            <div class="l">Aspirantes forjados</div>
          </div>
        </div>
        <div class="scroll-hint">
          <span class="bar"></span>
          El gank empieza al desplazar
        </div>
      </div>
    </div>
  </div>
</header>

<!-- ================= TICKER ================= -->
<div class="ticker" aria-hidden="true">
  <div class="ticker-track" id="ticker">
    <span>Domina la mente antes que el mapa</span>
    <span>El miedo es disciplina</span>
    <span>Cada partida es un espejo</span>
    <span>No existen los malos días, solo lecciones sin leer</span>
    <span>El tilt es una elección</span>
    <span>Sé el jungla de tu propia vida</span>
  </div>
</div>

<!-- ================= ESCALERA ================= -->
<section class="block" id="escalera">
  <div class="shell">
    <div class="sec-head reveal">
      <div class="left">
        <span class="eyebrow">// El método de las cinco puertas</span>
        <h2 class="section-title">La Escalera</h2>
        <p class="lead" style="margin-top:18px">La ascensión no es de elo — es de carácter. Cada puerta exige que mates una versión más débil de ti antes de cruzarla.</p>
      </div>
      <div class="num">01</div>
    </div>

    <div class="ladder">
      <article class="rung reveal" style="--tier:#6E7A86">
        <div class="rune">ᚺ</div>
        <div class="rung-id">
          <div class="tag">Hierro · Puerta I</div>
          <div class="ttl">El Despertar</div>
        </div>
        <p class="rung-desc">Dejas de culpar al jungla. La primera verdad: tus derrotas tienen tu nombre escrito. Aquí aprendes a leer la repetición sin mentirte.</p>
        <div class="rung-metrics">
          <span class="pill">Auto-review</span>
          <span class="pill">VOD x3 / sem</span>
          <span class="pill">0 excusas</span>
        </div>
      </article>

      <article class="rung reveal d1" style="--tier:#B07B4E">
        <div class="rune">ᛒ</div>
        <div class="rung-id">
          <div class="tag">Bronce · Puerta II</div>
          <div class="ttl">La Disciplina</div>
        </div>
        <p class="rung-desc">Los fundamentos se vuelven ritual: last hits, wave management, recalls. Lo aburrido repetido mil veces es lo que separa al que sueña del que sube.</p>
        <div class="rung-metrics">
          <span class="pill">CS@10 ≥ 80</span>
          <span class="pill">Rutina diaria</span>
          <span class="pill">Drills</span>
        </div>
      </article>

      <article class="rung reveal d2" style="--tier:#C9CBD0">
        <div class="rune">ᛋ</div>
        <div class="rung-id">
          <div class="tag">Plata · Puerta III</div>
          <div class="ttl">El Control</div>
        </div>
        <p class="rung-desc">El verdadero enemigo es el tilt. Entrenas el sistema nervioso: respiración, gestión de la derrota, cierre de cola. La calma se convierte en arma.</p>
        <div class="rung-metrics">
          <span class="pill teal">Tilt-zero</span>
          <span class="pill">Mindset 1:1</span>
          <span class="pill">Cola límite</span>
        </div>
      </article>

      <article class="rung reveal d2" style="--tier:#E0AE4A">
        <div class="rune">ᛟ</div>
        <div class="rung-id">
          <div class="tag">Oro · Puerta IV</div>
          <div class="ttl">La Visión</div>
        </div>
        <p class="rung-desc">Dejas de reaccionar y empiezas a predecir. Macro, tempo, win conditions: ves la partida tres movimientos antes de que suceda. El mapa habla, tú escuchas.</p>
        <div class="rung-metrics">
          <span class="pill gold">Macro avanzado</span>
          <span class="pill">Draft theory</span>
          <span class="pill">Win-con</span>
        </div>
      </article>

      <article class="rung reveal d3" style="--tier:#33E0C6">
        <div class="rune">ᛉ</div>
        <div class="rung-id">
          <div class="tag">Platino+ · Puerta V</div>
          <div class="ttl">El Dominio</div>
        </div>
        <p class="rung-desc">Ya no juegas para ganar — juegas para no perderte a ti mismo. Liderazgo de equipo, shotcalling, presencia. Te conviertes en el estándar que otros temen igualar.</p>
        <div class="rung-metrics">
          <span class="pill teal">Shotcalling</span>
          <span class="pill teal">Liderazgo</span>
          <span class="pill teal">Élite</span>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- ================= TEORÍAS ================= -->
<section class="block alt" id="teorias">
  <div class="shell">
    <div class="sec-head reveal">
      <div class="left">
        <span class="eyebrow gold">// Doctrina · Lo que enseñamos de verdad</span>
        <h2 class="section-title">Las Teorías</h2>
        <p class="lead" style="margin-top:18px">Seis principios que reescriben cómo piensas. No son trucos de elo — son formas de mirar que se quedan contigo cuando apagas el monitor.</p>
      </div>
      <div class="num">02</div>
    </div>

    <div class="theory-grid">
      <article class="theory reveal">
        <div class="theory-top">
          <div class="theory-glyph">I</div>
          <span class="pill teal">Mentalidad</span>
        </div>
        <h3>La Teoría del Espejo</h3>
        <p>Cada derrota es un reflejo, no un castigo. Si lo lees bien, la partida te dice exactamente qué versión de ti necesita morir hoy.</p>
        <div class="idx">// 001 — fundamento</div>
      </article>

      <article class="theory reveal d1">
        <div class="theory-top">
          <div class="theory-glyph">II</div>
          <span class="pill crimson">Psicología</span>
        </div>
        <h3>Tempo & Tilt</h3>
        <p>El momentum emocional decide partidas antes que el oro. Aprende a cortar la espiral de tilt en tres segundos y a montar tu propia ola.</p>
        <div class="idx">// 002 — control</div>
      </article>

      <article class="theory reveal d2">
        <div class="theory-top">
          <div class="theory-glyph">III</div>
          <span class="pill gold">Macro</span>
        </div>
        <h3>El Mapa Invisible</h3>
        <p>El 90% del mapa que no ves dicta tus decisiones. Entrenamos la inferencia: deducir lo oculto a partir de lo visible. Visión sin wards.</p>
        <div class="idx">// 003 — visión</div>
      </article>

      <article class="theory reveal">
        <div class="theory-top">
          <div class="theory-glyph">IV</div>
          <span class="pill teal">Hábito</span>
        </div>
        <h3>La Regla del 1%</h3>
        <p>No se sube de golpe. Se sube por acumulación invisible: un detalle por partida, repetido durante un split, multiplica tu techo sin que lo notes.</p>
        <div class="idx">// 004 — disciplina</div>
      </article>

      <article class="theory reveal d1">
        <div class="theory-top">
          <div class="theory-glyph">V</div>
          <span class="pill crimson">Liderazgo</span>
        </div>
        <h3>El Peso de la Voz</h3>
        <p>Un buen call vale más que una buena mecánica. La comunicación es una habilidad mecánica más: precisa, breve, sin ego. Se entrena, no se nace.</p>
        <div class="idx">// 005 — equipo</div>
      </article>

      <article class="theory reveal d2">
        <div class="theory-top">
          <div class="theory-glyph">VI</div>
          <span class="pill gold">Identidad</span>
        </div>
        <h3>El Arquetipo</h3>
        <p>No copies a tu main pro. Encuentra el estilo que coincide con quién eres. Subes más rápido cuando juegas en coherencia contigo mismo.</p>
        <div class="idx">// 006 — esencia</div>
      </article>
    </div>
  </div>
</section>

<!-- ================= MAESTRO ================= -->
<section class="block" id="maestro">
  <div class="shell">
    <div class="sec-head reveal">
      <div class="left">
        <span class="eyebrow">// El que abre las puertas</span>
        <h2 class="section-title">El Maestro</h2>
      </div>
      <div class="num">03</div>
    </div>

    <div class="maestro reveal">
      <div class="maestro-portrait">
        <div class="rank-badge">
          <span class="pill teal">Challenger</span>
          <span class="pill gold">Top 0.01%</span>
        </div>
        <span class="glyph">D</span>
        <span class="ph-label">[ retrato del maestro — iconografía ]</span>
      </div>
      <div class="maestro-body">
        <span class="eyebrow gold">// Fundador & Head Coach</span>
        <h3>DovahNDo</h3>
        <div class="role">Ex-pro · Jungla · 9 splits en Challenger</div>
        <p class="bio">Llegué a Challenger tres veces y caí dos. La tercera no fue por mecánica — fue porque por fin entendí que el rival nunca había sido el equipo enemigo. Era yo. Mi ego, mi prisa, mi miedo a perder.</p>
        <p class="bio">Fundé The Fear Academy para enseñar lo único que nadie te explica en una guía: que subir de elo es, en realidad, el método más honesto de conocerte. Aquí no vendemos atajos. Vendemos espejos.</p>
        <div class="stat-grid">
          <div class="stat-cell"><div class="n"><b>1,340</b></div><div class="l">Peak LP</div></div>
          <div class="stat-cell"><div class="n"><b>2.8</b>k</div><div class="l">Alumnos</div></div>
          <div class="stat-cell"><div class="n"><b>94</b>%</div><div class="l">Suben división</div></div>
          <div class="stat-cell"><div class="n"><b>9</b></div><div class="l">Splits Chall.</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= PRUEBA ================= -->
<section class="block alt" id="prueba">
  <div class="shell">
    <div class="sec-head reveal">
      <div class="left">
        <span class="eyebrow">// La evidencia no tiltea</span>
        <h2 class="section-title">La Prueba</h2>
      </div>
      <div class="num">04</div>
    </div>

    <div class="proof-stats reveal">
      <div class="proof-stat"><div class="n teal" data-count="94" data-suffix="%">0%</div><div class="l">Suben de división</div></div>
      <div class="proof-stat"><div class="n gold" data-count="412" data-prefix="+">0</div><div class="l">LP medio / split</div></div>
      <div class="proof-stat"><div class="n teal" data-count="2800" data-suffix="+">0</div><div class="l">Aspirantes forjados</div></div>
      <div class="proof-stat"><div class="n gold" data-count="61" data-suffix="%">0%</div><div class="l">Llegan a Diamante</div></div>
    </div>

    <div class="quotes">
      <article class="quote reveal">
        <div class="mark">“</div>
        <p>Pasé dos años atascado en Plata culpando a mis equipos. En tres meses entendí que el problema era mi tilt. Subí a Diamante I sin tocar un mecánico nuevo.</p>
        <div class="who">
          <div class="av">M</div>
          <div class="meta"><div class="nm">Marco V.</div><div class="rk">Plata IV → Diamante I</div></div>
        </div>
      </article>
      <article class="quote reveal d1">
        <div class="mark">“</div>
        <p>El review de VODs me dolió el ego como nada. Pero fue la primera vez que alguien me hizo responsable de verdad. Ahora juego con calma quirúrgica.</p>
        <div class="who">
          <div class="av">L</div>
          <div class="meta"><div class="nm">Lucía R.</div><div class="rk">Oro II → Maestro</div></div>
        </div>
      </article>
      <article class="quote reveal d2">
        <div class="mark">“</div>
        <p>No es una academia de League. Es terapia con pantalla de carga. Salí mejor jugador y, sin querer, mejor persona. Suena cursi. Es real.</p>
        <div class="who">
          <div class="av">D</div>
          <div class="meta"><div class="nm">Diego A.</div><div class="rk">Bronce III → Platino II</div></div>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- ================= ACCESO ================= -->
<section class="block" id="acceso">
  <div class="shell">
    <div class="sec-head reveal">
      <div class="left">
        <span class="eyebrow gold">// Sin cuenta · Sin pago · 100% local</span>
        <h2 class="section-title">El Acceso</h2>
        <p class="lead" style="margin-top:18px">La academia entera está abierta. No vendemos nada, no pedimos tu correo, no hay login. El método completo corre en tu propia máquina — para siempre.</p>
      </div>
      <div class="num">05</div>
    </div>

    <div class="access reveal">
      <div class="access-hero">
        <div class="price-free">GRATIS</div>
        <div class="price-strike">€0 para siempre</div>
        <p class="price-sub">El único precio es el trabajo. Nada más. Aquí no se compra el rango — se gana.</p>
        <a class="btn btn-primary" href="#top">Entrar a la Academia <span class="arrow">→</span></a>
        <div class="access-tags">
          <span class="pill teal">Sin login</span>
          <span class="pill gold">Sin pago</span>
          <span class="pill">100% local</span>
          <span class="pill">Sin anuncios</span>
        </div>
      </div>
      <div class="access-grid">
        <div class="access-item">
          <div class="ai-glyph">⌘</div>
          <h4>Todo el método</h4>
          <p>Las 5 puertas, las 6 teorías y los drills completos. Sin niveles bloqueados ni contenido premium.</p>
        </div>
        <div class="access-item">
          <div class="ai-glyph">⊘</div>
          <h4>Cero registro</h4>
          <p>No hay cuentas, ni contraseñas, ni correos. Abres la web y ya estás dentro.</p>
        </div>
        <div class="access-item">
          <div class="ai-glyph">◇</div>
          <h4>Corre en local</h4>
          <p>Tu progreso vive en tu propia máquina. Tus datos no salen de ahí. Sin nube, sin rastreo.</p>
        </div>
        <div class="access-item">
          <div class="ai-glyph">∞</div>
          <h4>Para siempre</h4>
          <p>Sin permanencia, sin caducidad, sin letra pequeña. Vuelve cuando quieras, las veces que quieras.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= FOOTER ================= -->
<footer class="foot">
  <div class="shell">
    <div class="foot-top">
      <div class="foot-brand">
        <div class="name">Dovah<span>N</span>Do</div>
        <p>The Fear Academy. El miedo es el primer maestro. Te enseñamos a escucharlo, dominarlo y, al final, agradecerlo.</p>
      </div>
      <div class="foot-cols">
        <div class="foot-col">
          <h4>Academia</h4>
          <a href="#escalera">La Escalera</a>
          <a href="#teorias">Las Teorías</a>
          <a href="#maestro">El Maestro</a>
          <a href="#acceso">Acceso libre</a>
        </div>
        <div class="foot-col">
          <h4>Recursos</h4>
          <a href="#">Manifiesto</a>
          <a href="#">Blog de doctrina</a>
          <a href="#">Glosario</a>
          <a href="#">FAQ</a>
        </div>
        <div class="foot-col">
          <h4>Contacto</h4>
          <a href="#"><span class="__cf_email__" data-cfemail="92e1fde2fde0e6f7d2f6fde4f3fafcf6fdbcf5f5">[email&#160;protected]</span></a>
          <a href="#">Prensa</a>
          <a href="#">Trabaja con nosotros</a>
        </div>
      </div>
    </div>
    <div class="foot-bottom">
      <div class="cr">© MMXXVI DovahNDo · The Fear Academy · No afiliado a Riot Games</div>
      <div class="socials">
        <a href="#" title="Discord">DC</a>
        <a href="#" title="Twitch">TW</a>
        <a href="#" title="X">X</a>
        <a href="#" title="YouTube">YT</a>
      </div>
    </div>
  </div>
</footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://unpkg.com/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
<script src="scene.js?v=16"></script>
<script src="main.js?v=10"></script>
</body>
</html>
