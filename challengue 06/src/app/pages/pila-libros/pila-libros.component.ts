import { AfterViewInit, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import * as d3 from 'd3';
import { BinarySearchTree, TreeNodeView } from '../../models/binary-search-tree';

@Component({
  selector: 'app-pila-libros',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pila-libros.component.html',
  styleUrl: './pila-libros.component.css',
})
export class PilaLibrosComponent implements AfterViewInit {
  @ViewChild('treeSvg', { static: true }) treeSvg!: ElementRef<SVGSVGElement>;

  private fb = inject(FormBuilder);
  private tree = new BinarySearchTree();
  private readonly valoresIniciales = [10, 5, 15, 3, 7, 12, 18, 1, 6];

  treeData = signal<TreeNodeView | null>(null);
  inorder = signal<number[]>([]);
  preorder = signal<number[]>([]);
  postorder = signal<number[]>([]);
  resultadoBusqueda = signal('Busca un valor para validar si existe en el árbol.');

  formulario = this.fb.nonNullable.group({
    value: [7, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.valoresIniciales.forEach((valor) => this.tree.insert(valor));
    this.actualizarRecorridos();

    console.group('Árbol binario - recorridos');
    console.log('Inorder:', this.inorder());
    console.log('Preorder:', this.preorder());
    console.log('Postorder:', this.postorder());
    console.groupEnd();
  }

  ngAfterViewInit(): void {
    this.renderTree();
  }

  insertarValor(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valor = Number(this.formulario.getRawValue().value);
    this.tree.insert(valor);
    this.actualizarRecorridos();
    this.renderTree();
    this.formulario.reset({ value: 0 });
  }

  buscarValor(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valor = Number(this.formulario.getRawValue().value);
    const existe = this.tree.contains(valor);

    this.resultadoBusqueda.set(
      existe
        ? `Sí existe el valor ${valor} en el árbol.`
        : `No existe el valor ${valor} en el árbol.`
    );
  }

  private actualizarRecorridos(): void {
    this.treeData.set(this.tree.toHierarchy());
    this.inorder.set(this.tree.inorder());
    this.preorder.set(this.tree.preorder());
    this.postorder.set(this.tree.postorder());
  }

  private renderTree(): void {
    const data = this.treeData();
    if (!data) {
      return;
    }

    const svg = d3.select(this.treeSvg.nativeElement);
    svg.selectAll('*').remove();

    const root = d3.hierarchy<TreeNodeView>(data);
    const treeLayout = d3.tree<TreeNodeView>().nodeSize([120, 110]);
    const posicionado = treeLayout(root);

    const width = Math.max(700, (posicionado.leaves().length + 1) * 140);
    const height = Math.max(400, (posicionado.height + 2) * 120);

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const contenedor = svg.append('g').attr('transform', 'translate(40, 30)');

    const links = contenedor
      .append('g')
      .selectAll('path')
      .data(posicionado.links())
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', '#7b8fa3')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .linkHorizontal<any, any>()
          .x((d: any) => d.y)
          .y((d: any) => d.x)
      );

    const nodes = contenedor
      .append('g')
      .selectAll('g')
      .data(posicionado.descendants())
      .join('g')
      .attr('transform', (d) => `translate(${d.y}, ${d.x})`);

    nodes
      .append('circle')
      .attr('r', 24)
      .attr('fill', '#2a9d8f')
      .attr('stroke', '#1d5f58')
      .attr('stroke-width', 2);

    nodes
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('font-weight', '700')
      .style('fill', '#ffffff')
      .text((d) => d.data.name);

    links.attr('d', d3.linkHorizontal<any, any>().x((d: any) => d.y).y((d: any) => d.x));
  }
}
