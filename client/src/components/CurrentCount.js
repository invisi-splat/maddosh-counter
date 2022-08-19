function CurrentCount(props) {
    return (
      <div id="current-count">
        <p className="animate__animated animate__fadeIn">We are currently at</p>
        <h1 className="animate__animated animate__fadeInUp">{props.data.at(-1)["Content"]}</h1>
      </div>
    )
}

export default CurrentCount