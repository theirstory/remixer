# ts-timeline-actions



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description | Type         | Default     |
| ------------------- | -------------------- | ----------- | ------------ | ----------- |
| `annotation`        | --                   |             | `Annotation` | `undefined` |
| `annotationEnabled` | `annotation-enabled` |             | `boolean`    | `undefined` |
| `editingEnabled`    | `editing-enabled`    |             | `boolean`    | `undefined` |


## Events

| Event      | Description | Type                      |
| ---------- | ----------- | ------------------------- |
| `annotate` |             | `CustomEvent<Annotation>` |
| `edit`     |             | `CustomEvent<Annotation>` |


## Dependencies

### Used by

 - [ts-video-controls](../video-controls)

### Depends on

- ion-button
- ion-icon

### Graph
```mermaid
graph TD;
  ts-timeline-actions --> ion-button
  ts-timeline-actions --> ion-icon
  ion-button --> ion-ripple-effect
  ts-video-controls --> ts-timeline-actions
  style ts-timeline-actions fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
