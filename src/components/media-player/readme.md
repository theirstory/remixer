# ts-video-player



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description | Type           | Default |
| ------------------- | -------------------- | ----------- | -------------- | ------- |
| `annotationEnabled` | `annotation-enabled` |             | `boolean`      | `false` |
| `annotations`       | --                   |             | `Annotation[]` | `null`  |
| `clips`             | --                   |             | `Clip[]`       | `[]`    |
| `editingEnabled`    | `editing-enabled`    |             | `boolean`      | `false` |


## Events

| Event      | Description | Type                      |
| ---------- | ----------- | ------------------------- |
| `annotate` |             | `CustomEvent<Annotation>` |
| `edit`     |             | `CustomEvent<Annotation>` |


## Methods

### `pause() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `play() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setCurrentTime(currentTime: number) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `stop() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [ts-video-clip-selector](../video-clip-selector)
 - [ts-video-output](../video-output)

### Depends on

- [ts-video-controls](../video-controls)

### Graph
```mermaid
graph TD;
  ts-video-player --> ts-video-controls
  ts-video-controls --> ts-timeline
  ts-video-controls --> ts-play-button
  ts-video-controls --> ts-time
  ts-video-controls --> ts-timeline-actions
  ts-play-button --> ion-button
  ts-play-button --> ion-icon
  ion-button --> ion-ripple-effect
  ts-timeline-actions --> ion-button
  ts-timeline-actions --> ion-icon
  ts-video-clip-selector --> ts-video-player
  ts-video-output --> ts-video-player
  style ts-video-player fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
