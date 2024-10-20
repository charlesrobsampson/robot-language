export default function Navbar(tag, nav, setNav, options) {
    const select = (selection) => {
        if (selection !== nav[tag]) {
            const newSelection = {
                ...nav,
                [tag]: selection
            }
            
            setNav(newSelection);
            window.localStorage.setItem('nav', JSON.stringify(newSelection));
        }
    }
    const disp = tab => {
        return (
            <div
                value={tab}
                key={tab}
                className={nav[tag] === tab ? 'nav-option-selected' : 'nav-option'}
                onClick={() => select(tab)}
            >
                <h3>{tab}</h3>
            </div>
        )
    }
    return (
        <div className="navbar">
            {options.map(option => {
                return disp(option)
            })}
        </div>
    )
}