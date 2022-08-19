function CurrentCount(props) {
    return (
      <div id="current-count">
        <p>We are currently at</p>
        <h1>{props.data.at(-1)["Content"]}</h1>
      </div>
    )
}

export default CurrentCount