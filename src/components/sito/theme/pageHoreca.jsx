export default async function PageHorecaUI({ horeca, theme, menu }) {

  // if (!alias || !horeca) {
  //   notFound();
  // }

  return (
    <div className="flex flex-col p-5 rounded-b-lg flex-1 gap-5 w-full">
      {/* COVER */}
      <div className="aspect-16/4 rounded-[4rem]" style={theme.cover} />
      {/* LOGO + NOME */}
      <div className="flex flex-row lg:h-30 h-20 rounded-[4rem] p-3" style={theme.header} >
        <div className="aspect-square rounded-full" style={theme.logo} />
        <div className="flex flex-col flex-1 p-5 items-start justify-center ">
          <h2 className="text-2xl font-bold text-neutral-900">{horeca.nome}</h2>
          <h3 className="text-xs text-neutral-500 italic">@{horeca.alias}</h3>
        </div>
        <div className="flex flex-col p-5 items-start justify-center ">
          social icon
        </div>
      </div>
      <div>
        {menu.map(m => (
          <p key={m.id}>{m.nome}</p>
        ))}
      </div>
    </div>
  );

}