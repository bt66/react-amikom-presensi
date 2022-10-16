import classes from "./Header.module.scss";

const Header = () => {
    return(
        <header className={classes.header}>
            <div className={classes.header__content}>
                <h2 className={classes.header__content__headerTitle}>Amikom Presensi</h2>
                <h3 className={classes.header__content__headerMenu}>About Me</h3>
            </div>
        </header>
    )
}

export default Header