# ts-play-button



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute                 | Description | Type      | Default     |
| ----------------------- | ------------------------- | ----------- | --------- | ----------- |
| `disabled`              | `disabled`                |             | `boolean` | `undefined` |
| `playing`               | `playing`                 |             | `boolean` | `undefined` |
| `scrubbingWhilePlaying` | `scrubbing-while-playing` |             | `boolean` | `undefined` |


## Events

| Event   | Description | Type               |
| ------- | ----------- | ------------------ |
| `pause` |             | `CustomEvent<any>` |
| `play`  |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [ts-video-controls](../video-controls)

### Depends on

- ion-button
- ion-icon

### Graph
```mermaid
graph TD;
  ts-play-button --> ion-button
  ts-play-button --> ion-icon
  ion-button --> ion-ripple-effect
  ts-video-controls --> ts-play-button
  style ts-play-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
