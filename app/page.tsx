"use client";

import { FormEvent, useMemo, useState } from "react";

type Category = "Todos" | "Entradas" | "Principais" | "Vegetarianos" | "Sobremesas";
type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, "Todos">;
  image: string;
  tag?: string;
};

const dishes: Dish[] = [
  { id: 1, name: "Croqueta de costela", description: "Costela defumada, aioli de páprica e picles da casa.", price: 42, category: "Entradas", image: "/prato-file.jpg", tag: "Mais pedido" },
  { id: 2, name: "Burrata da horta", description: "Tomates assados, pesto de manjericão e focaccia tostada.", price: 58, category: "Entradas", image: "/ambiente.jpg" },
  { id: 3, name: "Filé na brasa", description: "Filé-mignon, batatas rústicas, legumes e molho rôti.", price: 96, category: "Principais", image: "/prato-file.jpg", tag: "Assinatura" },
  { id: 4, name: "Tagliatelle da casa", description: "Massa fresca, cogumelos, parmesão e azeite de ervas.", price: 74, category: "Principais", image: "/prato-massa.jpg" },
  { id: 5, name: "Salmão cítrico", description: "Salmão grelhado, vegetais e beurre blanc de limão.", price: 88, category: "Principais", image: "/prato-peixe.jpg" },
  { id: 6, name: "Risoto de limão-siciliano", description: "Arroz carnaroli, parmesão, ervas frescas e azeite.", price: 69, category: "Vegetarianos", image: "/prato-risoto.jpg" },
  { id: 7, name: "Jardim mediterrâneo", description: "Grãos, legumes, folhas, coalhada e sementes tostadas.", price: 54, category: "Vegetarianos", image: "/prato-salada.jpg" },
  { id: 8, name: "Chocolate & caramelo", description: "Bolo quente, caramelo salgado e sorvete de baunilha.", price: 38, category: "Sobremesas", image: "/sobremesa.jpg" },
];

const Icon = ({ name }: { name: string }) => {
  const paths: Record<string, React.ReactNode> = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
    cart: <><path d="M4 5h2l2 10h9l2-7H7"/><circle cx="10" cy="19" r="1"/><circle cx="17" cy="19" r="1"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2M16 5a3 3 0 0 1 0 6m2 2a4 4 0 0 1 3 4v2"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
};

export default function Home() {
  const [category, setCategory] = useState<Category>("Todos");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(
    () => dishes.filter((dish) => category === "Todos" || dish.category === category),
    [category],
  );
  const totalItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const total = dishes.reduce((sum, dish) => sum + dish.price * (cart[dish.id] || 0), 0);

  function addDish(id: number) {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
  }
  function changeQuantity(id: number, amount: number) {
    setCart((current) => {
      const next = Math.max(0, (current[id] || 0) + amount);
      const updated = { ...current, [id]: next };
      if (!next) delete updated[id];
      return updated;
    });
  }
  function submitReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReserved(true);
  }
  function openReservation() {
    setReserved(false);
    setReserveOpen(true);
  }

  const whatsappOrder = encodeURIComponent(
    "Olá! Gostaria de fazer este pedido no Brasa & Oliva:\n" +
      dishes
        .filter((dish) => cart[dish.id])
        .map((dish) => `${cart[dish.id]}x ${dish.name} — R$ ${(dish.price * cart[dish.id]).toFixed(2).replace(".", ",")}`)
        .join("\n") +
      `\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`,
  );

  return <main>
    <header className="header">
      <a className="brand" href="#inicio"><span>BRASA</span><i>&</i><span>OLIVA</span><small>COZINHA CONTEMPORÂNEA</small></a>
      <nav className={menuOpen ? "nav open" : "nav"}>
        {["Início", "O restaurante", "Cardápio", "Contato"].map((item, index) => <a key={item} href={["#inicio", "#historia", "#cardapio", "#contato"][index]} onClick={() => setMenuOpen(false)}>{item}</a>)}
      </nav>
      <div className="header-actions">
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Abrir pedido"><Icon name="cart"/>{totalItems > 0 && <b>{totalItems}</b>}</button>
        <button className="reserve-button" onClick={openReservation}>Reservar mesa</button>
      </div>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu"><span/><span/></button>
    </header>

    <section className="hero" id="inicio">
      <div className="hero-overlay"/>
      <div className="hero-content">
        <p className="eyebrow"><span/> SÃO PAULO • DESDE 2018</p>
        <h1>Cozinha com fogo,<br/><em>afeto e tempo.</em></h1>
        <p>Ingredientes brasileiros, técnica contemporânea e a simplicidade de uma mesa bem servida.</p>
        <div className="hero-buttons"><button className="primary-button" onClick={openReservation}>Reservar uma mesa <Icon name="arrow"/></button><a className="secondary-button" href="#cardapio">Conhecer o cardápio</a></div>
      </div>
      <div className="hero-info">
        <div><Icon name="clock"/><span><small>HOJE</small>12h–16h • 19h–23h</span></div>
        <div><Icon name="pin"/><span><small>JARDINS</small>Al. Santos, 1420 • São Paulo</span></div>
        <div><strong>4,9</strong><span><small>AVALIAÇÃO</small>★★★★★ • 1.280 avaliações</span></div>
      </div>
    </section>

    <section className="intro" id="historia">
      <div className="intro-copy"><p className="eyebrow dark"><span/> NOSSA CASA</p><h2>Da brasa para a mesa,<br/><em>sem pressa.</em></h2><p>O Brasa & Oliva nasceu do encontro entre o calor do fogo e o frescor dos ingredientes. Nossa cozinha valoriza produtores locais, receitas honestas e tudo o que acontece quando boas pessoas se sentam à mesma mesa.</p><div className="signature"><b>Marina Ferraz</b><span>CHEF EXECUTIVA</span></div></div>
      <div className="intro-images"><img className="large" src="/ambiente.jpg" alt="Prato servido no Brasa & Oliva"/><div><img src="/prato-massa.jpg" alt="Massa fresca da casa"/><p><strong>Ingredientes frescos.</strong><br/>Cozinha feita todos os dias, do zero.</p></div></div>
    </section>

    <section className="menu-section" id="cardapio">
      <div className="section-heading"><p className="eyebrow light"><span/> SABORES DA CASA</p><h2>Nosso cardápio</h2><p>Pratos pensados para compartilhar, descobrir e querer voltar.</p></div>
      <div className="category-tabs">{(["Todos", "Entradas", "Principais", "Vegetarianos", "Sobremesas"] as Category[]).map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="dish-grid">{filtered.map((dish) => <article className="dish-card" key={dish.id} role="button" tabIndex={0} aria-label={`Ver detalhes de ${dish.name}`} onClick={() => setSelectedDish(dish)} onKeyDown={(event) => { if (event.currentTarget === event.target && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setSelectedDish(dish); } }}>
        <div className="dish-image"><img src={dish.image} alt={dish.name}/>{dish.tag && <span>{dish.tag}</span>}<button onClick={(event) => { event.stopPropagation(); addDish(dish.id); }} aria-label={"Adicionar " + dish.name}><Icon name="plus"/></button></div>
        <div className="dish-copy"><small>{dish.category}</small><h3>{dish.name}</h3><p>{dish.description}</p><div><strong>R$ {dish.price.toFixed(2).replace(".", ",")}</strong><button onClick={(event) => { event.stopPropagation(); addDish(dish.id); setCartOpen(true); }}>Pedir <Icon name="arrow"/></button></div></div>
      </article>)}</div>
    </section>

    <section className="experience">
      <div className="experience-image"><img src="/hero-restaurante.jpg" alt="Experiência no restaurante Brasa & Oliva"/></div>
      <div className="experience-copy"><p className="eyebrow light"><span/> EXPERIÊNCIA BRASA & OLIVA</p><h2>Uma noite para<br/><em>ficar na memória.</em></h2><p>Luz baixa, serviço atento, bons vinhos e uma cozinha que respeita o ritmo de cada mesa.</p><div className="experience-list"><span><b>01</b>Menu degustação em 7 tempos</span><span><b>02</b>Carta com mais de 120 rótulos</span><span><b>03</b>Salão privativo para celebrações</span></div><button className="primary-button" onClick={openReservation}>Viver essa experiência <Icon name="arrow"/></button></div>
    </section>

    <section className="reviews">
      <p className="eyebrow dark"><span/> QUEM VEM, CONTA</p>
      <blockquote>“Da recepção à sobremesa, tudo parece pensado com cuidado. O filé na brasa foi um dos melhores pratos que provamos em São Paulo.”</blockquote>
      <div className="review-author"><span>LC</span><div><strong>Luiza Carvalho</strong><small>Cliente verificada • Google</small></div></div>
    </section>

    <section className="visit" id="contato">
      <div className="visit-map"><div className="map-lines"/><span className="map-pin">B&O</span><small>JARDINS • SÃO PAULO</small></div>
      <div className="visit-copy"><p className="eyebrow"><span/> VENHA NOS VISITAR</p><h2>Sua mesa está<br/><em>esperando.</em></h2><div className="visit-row"><Icon name="pin"/><div><strong>Alameda Santos, 1420</strong><span>Jardins • São Paulo, SP</span></div></div><div className="visit-row"><Icon name="clock"/><div><strong>Terça a domingo</strong><span>Almoço 12h–16h • Jantar 19h–23h</span></div></div><div className="visit-row"><Icon name="calendar"/><div><strong>Reservas</strong><span>(11) 3081-2020 • reservas@brasaeoliva.com.br</span></div></div><button className="dark-button" onClick={openReservation}>Fazer uma reserva <Icon name="arrow"/></button></div>
    </section>

    <footer><a className="brand footer-brand" href="#inicio"><span>BRASA</span><i>&</i><span>OLIVA</span><small>COZINHA CONTEMPORÂNEA</small></a><p>Fogo, afeto e bons encontros.</p><div><a href="#historia">Nossa história</a><a href="#cardapio">Cardápio</a><button onClick={openReservation}>Reservas</button></div><small>© 2026 Brasa & Oliva.</small></footer>

    <a className="whatsapp" href="https://wa.me/551130812020?text=Olá!%20Gostaria%20de%20falar%20com%20o%20Brasa%20%26%20Oliva." target="_blank" rel="noreferrer" aria-label="Falar pelo WhatsApp">WA</a>

    {selectedDish && <div className="modal-backdrop" onMouseDown={() => setSelectedDish(null)}><div className="dish-modal" role="dialog" aria-modal="true" aria-labelledby="dish-title" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={() => setSelectedDish(null)} aria-label="Fechar detalhes">×</button><img className="dish-modal-image" src={selectedDish.image} alt={selectedDish.name}/><div className="dish-modal-copy"><p className="eyebrow dark"><span/> {selectedDish.category}</p><h2 id="dish-title">{selectedDish.name}</h2><p>{selectedDish.description}</p><div className="dish-details"><span>Preparo artesanal</span><span>Ingredientes frescos</span><span>Consulte alergênicos</span></div><div className="dish-modal-action"><strong>R$ {selectedDish.price.toFixed(2).replace(".", ",")}</strong><button className="primary-button" onClick={() => { addDish(selectedDish.id); setSelectedDish(null); setCartOpen(true); }}>Adicionar ao pedido <Icon name="arrow"/></button></div></div></div></div>}

    {cartOpen && <div className="drawer-backdrop" onMouseDown={() => setCartOpen(false)}><aside className="cart-drawer" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={() => setCartOpen(false)}>×</button><p className="eyebrow dark"><span/> SEU PEDIDO</p><h2>{totalItems ? `${totalItems} ${totalItems === 1 ? "item" : "itens"}` : "Sua sacola está vazia"}</h2><div className="cart-items">{dishes.filter((dish) => cart[dish.id]).map((dish) => <div className="cart-item" key={dish.id}><img src={dish.image} alt=""/><div><strong>{dish.name}</strong><span>R$ {dish.price.toFixed(2).replace(".", ",")}</span><div className="quantity"><button onClick={() => changeQuantity(dish.id, -1)}><Icon name="minus"/></button><b>{cart[dish.id]}</b><button onClick={() => changeQuantity(dish.id, 1)}><Icon name="plus"/></button></div></div></div>)}</div>{totalItems > 0 && <div className="cart-summary"><div><span>Total</span><strong>R$ {total.toFixed(2).replace(".", ",")}</strong></div><a className="primary-button" href={"https://wa.me/551130812020?text=" + whatsappOrder} target="_blank" rel="noreferrer">Finalizar pelo WhatsApp <Icon name="arrow"/></a></div>}{!totalItems && <><p className="empty-copy">Escolha seus pratos favoritos no cardápio e monte seu pedido.</p><button className="dark-button" onClick={() => {setCartOpen(false); document.querySelector("#cardapio")?.scrollIntoView({behavior:"smooth"});}}>Ver cardápio</button></>}</aside></div>}

    {reserveOpen && <div className="modal-backdrop" onMouseDown={() => setReserveOpen(false)}><div className="reserve-modal" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={() => setReserveOpen(false)}>×</button>{reserved ? <div className="success"><span>✓</span><h2>Reserva solicitada!</h2><p>Enviaremos a confirmação para o seu WhatsApp em alguns instantes.</p><button className="dark-button" onClick={() => setReserveOpen(false)}>Fechar</button></div> : <><p className="eyebrow dark"><span/> RESERVAS</p><h2>Prepare-se para uma<br/><em>experiência especial.</em></h2><form onSubmit={submitReservation}><label>Nome completo<input required placeholder="Seu nome"/></label><label>WhatsApp<input required type="tel" placeholder="(11) 99999-9999"/></label><label>Data<input required type="date"/></label><label>Horário<select defaultValue="20:00"><option>12:00</option><option>13:30</option><option>19:00</option><option>20:00</option><option>21:30</option></select></label><label>Pessoas<select><option>2 pessoas</option><option>3 pessoas</option><option>4 pessoas</option><option>5 pessoas</option><option>6+ pessoas</option></select></label><label>Ocasião<select><option>Jantar</option><option>Aniversário</option><option>Encontro</option><option>Evento corporativo</option></select></label><button className="primary-button" type="submit">Solicitar reserva <Icon name="arrow"/></button></form></>}</div></div>}
  </main>;
}
